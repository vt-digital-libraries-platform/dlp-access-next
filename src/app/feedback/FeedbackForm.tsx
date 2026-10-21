"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import DOMPurify from "dompurify";

// sanitizeMessage: strips \r and invisible control characters from the message field.
// Keeps \n so the user's line breaks and paragraphs are preserved.
// \r is stripped because email parsers use \r\n as a header separator.
const sanitizeMessage = (value: string) => {
  return DOMPurify.sanitize(value).replace(/[\r\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");
};

// sanitizeEmail: strips everything including \n from the email field.
// Email addresses should never contain line breaks — any \r or \n in an email
// field is either a mistake or a header injection attempt.
const sanitizeEmail = (value: string) => {
  return DOMPurify.sanitize(value).replace(/[\r\n\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");
};

// validateEmail: stricter than the browser's built-in type="email" check.
// The browser accepts "a@b" (no TLD). This regex requires:
// [one or more non-space/non-@ chars] @ [domain] . [2+ char TLD]
const validateEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
};

// How long (in seconds) to lock the submit button after a successful submission.
// Prevents accidental double-submits and slows down manual spam attempts.
const COOLDOWN_SECONDS = 30;

// dlp-access reads this from the site's siteOptions.feedbackEmail, falling back to this
// address; no site sets feedbackEmail, so the fallback is always used.
const FEEDBACK_EMAIL = "digitallibraries@vt.edu";

const FEEDBACK_API_ENDPOINT = process.env.NEXT_PUBLIC_FEEDBACK_API_ENDPOINT;

interface Props {
  siteName: string
}

/**
 * The Contact Us / Feedback form, copied from dlp-access's FeedbackPage. Submissions go to the
 * submitFeedback Lambda (src/app/_lambda/submitFeedback) through API Gateway.
 *
 * @param siteName The site's name, shown in the intro and sent with each submission
 * @returns the feedback form
 */
export default function FeedbackForm({ siteName }: Props) {
  const [feedbackType, setFeedbackType] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [submittedBy, setSubmittedBy] = useState("");
  // honeypot: a hidden field only bots fill in. Real users never see it
  // (visually hidden + aria-hidden). If it has a value at submit time we
  // silently discard the submission without alerting the bot.
  const [honeypot, setHoneypot] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  // cooldownSecondsLeft: counts down from COOLDOWN_SECONDS after a successful
  // submit. While > 0 the submit button is disabled and shows the countdown.
  const [cooldownSecondsLeft, setCooldownSecondsLeft] = useState(0);
  // Kept in a ref (not state) — updating it doesn't trigger a re-render.
  // null means no timer is currently running.
  const cooldownInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  // Clears the timer when the user navigates away from the page, so the
  // setInterval doesn't keep firing on an unmounted component.
  useEffect(() => {
    return () => {
      if (cooldownInterval.current) {
        clearInterval(cooldownInterval.current);
      }
    };
  }, []);

  // Starts the 30-second countdown after a successful submission.
  // Uses the functional update form (prev => ...) so the interval callback
  // always sees the latest value rather than a stale closure copy.
  const startCooldown = () => {
    setCooldownSecondsLeft(COOLDOWN_SECONDS);
    cooldownInterval.current = setInterval(() => {
      setCooldownSecondsLeft((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          if (cooldownInterval.current) clearInterval(cooldownInterval.current);
          cooldownInterval.current = null;
          return 0;
        }
        return next;
      });
    }, 1000);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Bot check — if the hidden honeypot field has any value, this is a bot.
    // Return silently with no error so the bot doesn't know it was caught.
    if (honeypot) return;

    // Reject malformed emails before the Lambda is called.
    // Only runs if the user typed something — email is optional.
    if (submittedBy && !validateEmail(submittedBy)) {
      setSubmitError("Please enter a valid email address (e.g. name@domain.com).");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // Validate feedback type selected
    if (!feedbackType) {
      setSubmitError("Please select a feedback type.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // Validate email required for Accessibility Barrier
    if (feedbackType === "Accessibility Barrier" && !submittedBy.trim()) {
      setSubmitError("Email is required when reporting an accessibility barrier.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // Show loading state
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      // Empty message falls through to the generic error below
      if (!FEEDBACK_API_ENDPOINT) throw new Error("");

      // Call Lambda function with sanitized values
      const res = await fetch(`${ FEEDBACK_API_ENDPOINT }/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          feedbackType,
          message: sanitizeMessage(feedbackMessage),
          siteName,
          emailTo: FEEDBACK_EMAIL,
          // Send empty string when no email provided — the Lambda handles
          // the "Anonymous" fallback so we don't send a non-email string
          // that would fail the Lambda's email format validation
          submittedBy: sanitizeEmail(submittedBy),
        }),
      });
      const response = await res.json().catch(() => ({}));

      // The Lambda's specific message (e.g. "Invalid feedback type") is in the
      // response body; dlp-access read it from Amplify's error.response.data.message
      if (!res.ok) throw new Error(response.message || `Request failed with status code ${ res.status }`);

      if (response.success) {
        // Show success message and clear form
        setIsSubmitting(false);
        setSubmitSuccess(true);
        setFeedbackType("");
        setFeedbackMessage("");
        setSubmittedBy("");

        // Start 30-second cooldown to prevent rapid resubmission
        startCooldown();

        // Scroll to top to see success message
        window.scrollTo({ top: 0, behavior: "smooth" });

        // Auto-hide success message after 5 seconds
        setTimeout(() => {
          setSubmitSuccess(false);
        }, 5000);
      } else {
        throw new Error(response.message || "Failed to submit feedback");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setIsSubmitting(false);
      setSubmitError(
        (error instanceof Error && error.message) ||
        "Failed to submit feedback. Please try again or email us directly."
      );

      // Scroll to top to see error message
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="container typography-wrapper">
      <h1>Feedback Form</h1>
      <h2 className="visually-hidden">Submit Feedback</h2>
      <div className="feedback-content">
        <p>
          Use this form to report accessibility barriers, issues, or provide
          general feedback about { siteName }. Your submission will be logged
          and emailed to our team at{ " " }
          <a href={ `mailto:${ FEEDBACK_EMAIL }` }>{ FEEDBACK_EMAIL }</a>.
        </p>

        <form onSubmit={ handleSubmit } className="feedback-form">
          { /* Honeypot: Invisible to humans, bots fill it in. If filled on submit, the submission is silently dropped. */ }
          <input
            type="text"
            name="website"
            value={ honeypot }
            onChange={ (e) => setHoneypot(e.target.value) }
            style={ { display: "none" } }
            aria-hidden="true"
            tabIndex={ -1 }
            autoComplete="off"
          />

          { /* Feedback Form Fields */ }
          <fieldset className="feedback-type-fieldset">
            <legend>Feedback Type (Required)</legend>
            <div className="radio-group">
              <div className="radio-option">
                <input
                  type="radio"
                  id="accessibility-barrier"
                  name="feedbackType"
                  value="Accessibility Barrier"
                  checked={ feedbackType === "Accessibility Barrier" }
                  onChange={ (e) => setFeedbackType(e.target.value) }
                />
                <label htmlFor="accessibility-barrier">
                  Accessibility Barrier
                </label>
              </div>
              <div className="radio-option">
                <input
                  type="radio"
                  id="issue"
                  name="feedbackType"
                  value="Issue"
                  checked={ feedbackType === "Issue" }
                  onChange={ (e) => setFeedbackType(e.target.value) }
                />
                <label htmlFor="issue">Issue</label>
              </div>
              <div className="radio-option">
                <input
                  type="radio"
                  id="general-feedback"
                  name="feedbackType"
                  value="General Feedback"
                  checked={ feedbackType === "General Feedback" }
                  onChange={ (e) => setFeedbackType(e.target.value) }
                />
                <label htmlFor="general-feedback">
                  Feedback or Suggestion
                </label>
              </div>
            </div>
          </fieldset>

          <div className="form-control">
            <label htmlFor="feedback-message">Details (Required)</label>
            <p id="detailsHelp" className="feedback-instructions">
              To help us better understand your feedback or issue, please
              include your device type, operating system, web browser, and
              the name or URL of the page your feedback is about.
              <em>
                { " " }
                Example: &quot;I encountered an issue on the homepage while using
                Safari on an iPhone running iOS 26.5.&quot;
              </em>
            </p>
            <textarea
              id="feedback-message"
              name="feedbackMessage"
              value={ feedbackMessage }
              onChange={ (e) => setFeedbackMessage(e.target.value) }
              required
              rows={ 8 }
              maxLength={ 5000 }
              aria-describedby="detailsHelp"
              disabled={ isSubmitting }
            />
          </div>

          <div className="form-control">
            <label htmlFor="submitted-by">
              Your Email
              { feedbackType === "Accessibility Barrier"
                ? " (Required)"
                : " (Optional)" }
            </label>
            <p id="emailHelp" className="feedback-instructions">
              Please provide your email address
              { feedbackType === "Accessibility Barrier"
                ? " so we can contact you about your barrier report and resolve any access issues."
                : " if you'd like for us to follow up with you." }
            </p>
            <input
              type="email"
              autoComplete="email"
              id="submitted-by"
              name="submittedBy"
              value={ submittedBy }
              onChange={ (e) => setSubmittedBy(e.target.value) }
              aria-describedby="emailHelp"
              disabled={ isSubmitting }
              maxLength={ 254 }
              required={ feedbackType === "Accessibility Barrier" }
            />
          </div>

          { submitSuccess && (
            <div className="alert alert-success" role="alert">
              <strong>Success!</strong> Your feedback has been submitted.
            </div>
          ) }

          { submitError && (
            <div className="alert alert-danger" role="alert">
              <strong>Error:</strong> { submitError }
              <p>
                If you encounter this issue again, please email us at&nbsp;
                <a href={ `mailto:${ FEEDBACK_EMAIL }` }>{ FEEDBACK_EMAIL }</a>
              </p>
            </div>
          ) }

          <button
            type="submit"
            className="submit-button"
            disabled={ isSubmitting || cooldownSecondsLeft > 0 }
          >
            { isSubmitting
              ? "Submitting..."
              : cooldownSecondsLeft > 0
                ? `Please wait ${ cooldownSecondsLeft }s...`
                : "Submit Feedback" }
          </button>
        </form>
      </div>
    </div>
  );
}
