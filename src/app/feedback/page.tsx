import type { Metadata } from "next";
import { getSite } from "@/app/_utils/fetchUtils/getSite";
import FeedbackForm from "./FeedbackForm";
import "./page.css";

export const metadata: Metadata = {
  title: "Feedback",
};

/**
 * Contact Us / Feedback page, like dlp-access's FeedbackPage.
 *
 * @returns the feedback form for this site
 */
export default async function FeedbackPage() {
  const site = await getSite();

  return <FeedbackForm siteName={ site?.siteName ?? "" } />;
}
