import { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { toast } from "sonner";
import { useTheme } from "../../../hooks/useTheme";

export default function PaymentForm({ clientSecret, onSuccess, onCancel }) {
    const stripe = useStripe();
    const elements = useElements();
    const { isDark } = useTheme();
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsProcessing(true);
        setError(null);

        const cardElement = elements.getElement(CardElement);

        const { error, paymentIntent } = await stripe.confirmCardPayment(
            clientSecret,
            {
                payment_method: {
                    card: cardElement,
                },
            },
        );

        if (error) {
            setError(error.message);
            toast.error(error.message);
            setIsProcessing(false);
        } else if (paymentIntent.status === "succeeded") {
            try {
                await onSuccess(paymentIntent.id);
                toast.success("Payment confirmed and enrollment updated");
            } catch (verificationError) {
                setError(verificationError.message || "Payment succeeded but enrollment verification failed. Contact support before trying to pay again.");
                toast.error("Payment succeeded, but enrollment could not be verified");
            } finally {
                setIsProcessing(false);
            }
        } else {
            setIsProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="mb-2 block text-sm font-medium text-foreground ">
                    Card Details
                </label>
                <div className="rounded-xl border border-border bg-surface p-4  dark:bg-background">
                    <CardElement
                        options={{
                            style: {
                                base: {
                                    fontSize: "16px",
                                    color: isDark ? "#F2F4EE" : "#14211C",
                                    "::placeholder": {
                                        color: isDark ? "#A9B6AE" : "#5B6B63",
                                    },
                                },
                                invalid: {
                                    color: isDark ? "#FCA5A5" : "#C0453F",
                                },
                            },
                        }}
                    />
                </div>
            </div>

            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/30">
                    <p className="text-sm text-red-600 dark:text-red-300">{error}</p>
                </div>
            )}

            <div className="flex gap-3">
                <button
                    type="submit"
                    disabled={!stripe || !clientSecret || isProcessing}
                    className="flex-1 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-secondary disabled:cursor-not-allowed disabled:opacity-50 dark:bg-accent dark:text-accent-foreground"
                >
                    {isProcessing ? "Processing..." : "Pay Now"}
                </button>

                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 rounded-xl border border-border px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-surface-secondary   "
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}
