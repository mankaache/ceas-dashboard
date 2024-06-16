import { NextApiRequest, NextApiResponse } from "next";

import nc from "next-connect";
import cors from "cors";
import { google } from "googleapis";
import { JWT, JWTOptions } from "google-auth-library";
import { BetaAnalyticsDataClient } from "@google-analytics/data";

const key = {
  type: process.env.GOOGLE_APPLICATION_ACCOUNT_TYPE,
  project_id: process.env.GOOGLE_APPLICATION_PROJECT_ID,
  private_key_id: process.env.GOOGLE_APPLICATION_PRIVATE_KEY_ID,
  private_key: process.env.GOOGLE_APPLICATION_PRIVATE_KEY,
  client_email: process.env.GOOGLE_APPLICATION_CLIENT_EMAIL,
  client_id: process.env.GOOGLE_APPLICATION_CLIENT_ID,
  auth_uri: process.env.GOOGLE_APPLICATION_AUTH_URI,
  token_uri: process.env.GOOGLE_APPLICATION_TOKEN_URI,
  auth_provider_x509_cert_url:
    process.env.GOOGLE_APPLICATION_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.GOOGLE_APPLICATION_CLIENT_X509_CERT_URL,
  universe_domain: process.env.GOOGLE_APPLICATION_UNIVERSE_DOMAIN,
};

const viewId = process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID;
const propertyId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_PROPERTY_ID;

const handler = nc<NextApiRequest, NextApiResponse>({
  onError: (err, req, res) => {
    console.error(err.stack);
    res.status(500).send("Something broke!");
  },
  onNoMatch: (req, res) => {
    res.status(404).send("Page is not found");
  },
});

handler.use(cors());

handler.get(async (req, res) => {
  try {
    // Using a default constructor instructs the client to use the credentials
    // specified in GOOGLE_APPLICATION_APPLICATION_CREDENTIALS environment variable.
    const analyticsDataClient = new BetaAnalyticsDataClient({
      credentials: key,
    });

    // Runs a simple report.
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: "30daysAgo",
          endDate: "today",
        },
      ],
      dimensions: [
        {
          name: "date",
        },
      ],
      metrics: [
        {
          name: "activeUsers",
        },
      ],
    });

    console.log("Report result:");
    response?.rows?.forEach((row) => {
      // @ts-ignore
      console.log(row?.dimensionValues[0], row?.metricValues[0]);
    });

    console.log("response: " + JSON.stringify(response));

    res.status(200).json("");
  } catch (error) {
    console.error("Error fetching analytics data", error);
    res.status(500).json({ error: "Error fetching analytics data" });
  }
});

export default handler;
