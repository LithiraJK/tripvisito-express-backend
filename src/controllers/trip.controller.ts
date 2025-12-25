import { Request, Response } from "express";
import axios from "axios";
import { env } from "../config/env";
import { sendError, sendSuccess } from "../services/api.response.util";
import { Trip } from "../models/trip.model";
import { AuthRequest } from "../middlewares/auth.middleware";

export function parseMarkdownToJSON(markdownString: string): any {
  const regex = /```json([\s\S]*?)```/;
  const match = markdownString.match(regex);

  if (match && match[1]) {
    try {
      return JSON.parse(match[1].trim());
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return null;
    }
  }
  console.error("No valid JSON found in markdown text.");
  return null;
}

export const generateTrip = async (req: AuthRequest, res: Response) => {
  try {
    const {
      country,
      travelStyle,
      interests,
      budget,
      duration,
      groupType,
      maxToken,
    } = req.body;


    const prompt = `
Generate a ${duration}-day travel itinerary for ${country} based on the following user information.

Budget: ${budget}
Interests: ${interests}
TravelStyle: ${travelStyle}
GroupType: ${groupType}

IMPORTANT RULES:
- Return ONLY valid JSON
- Do NOT use markdown
- Do NOT include explanations or extra text
- All values must be valid JSON
- itinerary must contain exactly ${duration} days

JSON STRUCTURE:
{
  "name": "A descriptive title for the trip",
  "description": "Brief description under 100 words",
  "estimatedPrice": "Lowest average price in USD",
  "duration": ${duration},
  "budget": "${budget}",
  "travelStyle": "${travelStyle}",
  "country": "${country}",
  "interests": ${interests},
  "groupType": "${groupType}",
  "bestTimeToVisit": [
    "🌸 Spring (from month to month): reason",
    "☀️ Summer (from month to month): reason",
    "🍁 Autumn (from month to month): reason",
    "❄️ Winter (from month to month): reason"
  ],
  "weatherInfo": [
    "🌸 Spring: temperature range in °C (°F)",
    "☀️ Summer: temperature range in °C (°F)",
    "🌧️ Monsoon: temperature range in °C (°F)",
    "❄️ Winter: temperature range in °C (°F)"
  ],
  "location": {
    "city": "City or region name",
    "coordinates": [latitudeNumber, longitudeNumber],
    "openStreetMap": "https://www.openstreetmap.org/..."
  },
  "itinerary": [
    {
      "day": 1,
      "location": "City/Region Name",
      "activities": [
        {"time": "Morning", "description": "🏰 Activity"},
        {"time": "Afternoon", "description": "🖼️ Activity"},
        {"time": "Evening", "description": "🍽️ Activity"}
      ]
    }
  ]
}
`;

    // Call to Google Gemini API
    const aiResponse = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          maxOutputTokens: maxToken || 2500,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": env.GEMINI_API_KEY,
        },
      }
    );

    // Extract generated content from the response
    const generatedContent =
      aiResponse.data?.candidates?.[0]?.content?.[0]?.text ||
      aiResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No data";

    // const parsedContent = parseMarkdownToJSON(generatedContent);
    // const parsedContent = generatedContent;

    let parsedContent;
    try {
      parsedContent = JSON.parse(generatedContent);
    } catch (e) {
      console.error("JSON parse error:", generatedContent);
      return sendError(res, 500, "Invalid AI JSON response");
    }

    if (!parsedContent) {
      return sendError(res, 500, "Failed to parse AI response");
    }

    let imageUrls: string[] = [];
    try {
      if (!env.UNSPLASH_ACCESS_KEY) {
        console.warn("Unsplash API key not configured, skipping image fetch");
      } else {
        const searchQuery = [country, interests, travelStyle]
          .filter(Boolean)
          .join(" ");

        console.log("Fetching images for query:", searchQuery);

        const imageResponse = await axios.get(
          `https://api.unsplash.com/search/photos`,
          {
            params: {
              query: searchQuery,
              client_id: env.UNSPLASH_ACCESS_KEY,
              orientation: "landscape",
              per_page: 3,
            },
          }
        );

        console.log(
          "Unsplash API response:",
          imageResponse.data.results?.length || 0,
          "images found"
        );

        imageUrls = imageResponse.data.results
          .map((img: any) => img.urls?.regular)
          .filter(
            (url: string | undefined) => url !== undefined && url !== null
          ) as string[];
      }
    } catch (imageError: any) {
      console.error("Error fetching images from Unsplash:", imageError.message);
      if (imageError.response) {
        console.error("Unsplash API error details:", imageError.response.data);
      }
      // Continue without images rather than failing the entire request
      imageUrls = [];
    }

    const newTrip = await Trip.create({
      tripDetails: JSON.stringify(parsedContent),
      imageUrls: imageUrls,
      paymentLink: "",
      createdAt: new Date(),
      userId: req.user?.sub,
    });

    if (!newTrip) {
      return sendError(res, 500, "Failed to save the trip");
    }
    sendSuccess(res, 200, "Trip generated successfully", {
      trip: parsedContent,
      tripId: newTrip.id,
      images: imageUrls,
    });
  } catch (error) {
    console.error("Error generating content:", error);
    sendError(res, 500, "Failed to generate a trip");
  }
};

export const getTripById = async (req: AuthRequest, res: Response) => {
  try {
    const { tripId } = req.params;
    const trip = await Trip.findById(tripId);

    if (!trip) {
      return sendError(res, 404, "Trip not found");
    }
    sendSuccess(res, 200, "Trip retrieved successfully", {
      trip: {
        ...trip.toObject(),
        tripDetails: JSON.parse(trip.tripDetails),
      },
    });
  } catch (error) {
    console.error("Error retrieving trip:", error);
    sendError(res, 500, "Failed to retrieve the trip");
  }
};

export const getAllTrips = async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 8;
    const skip = (page - 1) * limit;

    const trips = await Trip.find()
      .populate("userId")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Trip.countDocuments();

    const tripCards = trips.map((trip) => {
      return {
        id: trip._id.toString(),
        tripDetails: JSON.parse(trip.tripDetails),
        imageUrls: trip.imageUrls,
      };
    });

    sendSuccess(res, 200, "Trips data", {
      trips: tripCards,
      totalPages: Math.ceil(total / limit),
      totalCount: total,
      page,
    });
  } catch (error) {
    console.error("Error retrieving trips:", error);
    sendError(res, 500, "Failed to retrieve trips");
  }
};

export const updateTrip = async (req: AuthRequest, res: Response) => {
  try {
    const { tripId } = req.params;
    const updateData = req.body;

    if (!req.user) {
      return sendError(res, 401, "Unauthorized");
    }

    // Find the trip first
    const trip = await Trip.findById(tripId);

    if (!trip) {
      return sendError(res, 404, "Trip not found");
    }

    // Check if the user owns this trip
    if (trip.userId.toString() !== req.user.sub) {
      return sendError(res, 403, "You don't have permission to update this trip");
    }

    // Update the trip
    const updatedTrip = await Trip.findByIdAndUpdate(
      tripId,
      {
        ...(updateData.tripDetails && { tripDetails: JSON.stringify(updateData.tripDetails) }),
        ...(updateData.imageUrls && { imageUrls: updateData.imageUrls }),
        ...(updateData.paymentLink !== undefined && { paymentLink: updateData.paymentLink }),
      },
      { new: true }
    );

    if (!updatedTrip) {
      return sendError(res, 500, "Failed to update the trip");
    }

    sendSuccess(res, 200, "Trip updated successfully", {
      trip: {
        ...updatedTrip.toObject(),
        tripDetails: JSON.parse(updatedTrip.tripDetails),
      },
    });
  } catch (error) {
    console.error("Error updating trip:", error);
    sendError(res, 500, "Failed to update the trip");
  }
};


export const getTripsByUser = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return sendError(res, 401, "Unauthorized");
    }
    const userId = req.user.sub;

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 8;
    const skip = (page - 1) * limit;

    const trips = await Trip.find({ userId: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
      
    const total = await Trip.countDocuments({ userId: userId });

    const tripCards = trips.map(trip => {
      return {
        id: trip._id.toString(),
        tripDetails: JSON.parse(trip.tripDetails),
        imageUrls: trip.imageUrls
      };
    });

    sendSuccess(res, 200, "User trips retrieved successfully", {
      trips: tripCards,
      totalPages: Math.ceil(total / limit),
      totalCount: total,
      page,
    });
  } catch (error) {
    console.error("Error retrieving user trips:", error);
    sendError(res, 500, "Failed to retrieve user trips");
  }
};
