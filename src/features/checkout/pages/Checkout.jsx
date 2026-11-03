import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { ArrowLeft, CreditCard, Lock, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import PaymentForm from "../components/PaymentForm";
import DemoPaymentForm from "../components/DemoPaymentForm";
import CheckoutSummary from "../components/CheckoutSummary";
import CouponInput from "../components/CouponInput";
import {
    useCreateOrder,
    useCreatePayment,
    useVerifyPayment,
} from "../hooks/usePayment";
import PageLoader from "../../../components/common/PageLoader";
import { getCourseFromResponse } from "../../courses/utils/courseHelpers";
import { useCourse } from "../../courses/hooks/useCourses";
import { ROUTES } from "../../../constants/routes";
import { useTheme } from "../../../hooks/useTheme";

const stripeKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
const hasStripeKey = /^pk_(test|live)_/.test(stripeKey || "");
const stripePromise = hasStripeKey ? loadStripe(stripeKey) : null;

function getPaymentDetails(response) {
    const payload = response?.data ?? response;
    const clientSecret =
        payload?.clientSecret ??
        payload?.client_secret ??
        payload?.paymentIntent?.client_secret ??
        payload?.data?.clientSecret ??
        null;
    const paymentIntentId =
        payload?.paymentIntentId ??
        payload?.paymentIntent?.id ??
        payload?.data?.paymentIntentId ??
        clientSecret?.split("_secret")?.[0] ??
        null;

    return { payload, clientSecret, paymentIntentId };
}

export default function Checkout() {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const { isDark } = useTheme();
    const { data: courseResponse, isLoading, isError, error } = useCourse(courseId);

    const course = getCourseFromResponse(courseResponse);
    const createPayment = useCreatePayment();
    const createOrder = useCreateOrder();
    const verifyPayment = useVerifyPayment();

    const [paymentSession, setPaymentSession] = useState(null);
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [discountedPrice, setDiscountedPrice] = useState(null);

    const handleInitiatePayment = async () => {
        try {
            const paymentData = {
                courseId,
                ...(appliedCoupon?.code ? { couponCode: appliedCoupon.code } : {}),
            };

            const response = await createPayment.mutateAsync(paymentData);
            const { payload, clientSecret, paymentIntentId } = getPaymentDetails(response);

            if (!clientSecret && !paymentIntentId) {
                throw new Error(
                    "The payment API did not return a payment intent. Check the backend payment configuration.",
                );
            }

            const isDemoPayment =
                /mock/i.test(clientSecret || "") || /mock/i.test(paymentIntentId || "");

            if (isDemoPayment) {
                setPaymentSession({
                    mode: "demo",
                    paymentIntentId,
                    amount: Number(payload?.amount ?? discountedPrice ?? course?.price ?? 0),
                });
                return;
            }

            if (!hasStripeKey) {
                throw new Error(
                    "VITE_STRIPE_PUBLIC_KEY is missing from your environment configuration.",
                );
            }

            if (!clientSecret) {
                throw new Error("The payment API did not return a Stripe client secret.");
            }

            setPaymentSession({ mode: "stripe", clientSecret });
        } catch (error) {
            const message =
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                error.message ||
                "Unable to start payment";

            if (/already enrolled/i.test(message)) {
                toast.info("You are already enrolled — opening your course.");
                navigate(ROUTES.MY_LEARNING, {
                    replace: true,
                    state: { courseId },
                });
                return;
            }

            toast.error(message);
        }
    };

    const handleDemoPayment = async () => {
        try {
            await createOrder.mutateAsync({
                courseId,
                payment_info: {
                    id: paymentSession?.paymentIntentId ?? `pi_demo_${Date.now()}`,
                    status: "succeeded",
                },
            });
            navigate(ROUTES.PAYMENT_SUCCESS, {
                state: { courseId, demo: true },
            });
        } catch {
            // The mutation surfaces the API error toast.
        }
    };

    const handlePaymentSuccess = async (paymentIntentId) => {
        await verifyPayment.mutateAsync({
            paymentIntentId,
            courseId,
            ...(appliedCoupon?.code ? { couponCode: appliedCoupon.code } : {}),
        });
        navigate(ROUTES.PAYMENT_SUCCESS, { state: { courseId } });
    };

    if (isLoading) return <PageLoader />;

    if (isError || !course) {
        return (
            <div className="min-h-screen bg-background p-6">
                <div className="mx-auto max-w-3xl rounded-2xl border border-danger/30 bg-danger/10 p-6">
                    <p className="font-semibold text-danger">Course not found</p>
                    <p className="mt-1 text-sm text-foreground-secondary">
                        {error?.message ||
                            "This course is unavailable or no longer published."}
                    </p>
                    <button
                        type="button"
                        onClick={() => navigate(ROUTES.MARKETPLACE)}
                        className="mt-4 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
                    >
                        Browse courses
                    </button>
                </div>
            </div>
        );
    }

    const finalPrice = discountedPrice ?? course.price;

    const appearance = {
        theme: "stripe",
        variables: {
            colorPrimary: isDark ? "#D5ED83" : "#1D4B3C",
            colorBackground: isDark ? "#1B2622" : "#FFFFFF",
            colorText: isDark ? "#F2F4EE" : "#14211C",
            colorDanger: isDark ? "#FCA5A5" : "#C0453F",
        },
    };

    const options = {
        appearance,
    };

    return (
        <div className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <button
                    onClick={() => navigate(-1)}
                    className="mb-6 flex items-center gap-2 text-sm font-medium text-foreground-secondary transition hover:text-foreground"
                >
                    <ArrowLeft className="size-4" />
                    Back
                </button>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <div className="mb-6 rounded-2xl border border-border bg-surface p-6 shadow-sm">
                            <h1 className="mb-2 text-2xl font-bold text-foreground">Checkout</h1>
                            <p className="text-foreground-secondary">Complete your purchase</p>
                        </div>

                        {!paymentSession ? (
                            <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
                                <div className="mb-6 flex items-center gap-2">
                                    <CreditCard className="size-5 text-brand-secondary" />
                                    <h2 className="text-xl font-semibold text-foreground">Payment Method</h2>
                                </div>

                                {!hasStripeKey && (
                                    <div className="mb-5 flex gap-3 rounded-xl border border-border bg-surface-secondary p-4 text-sm">
                                        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-brand-secondary" />
                                        <p className="text-foreground-secondary">
                                            <span className="font-semibold text-foreground">Test checkout.</span>{" "}
                                            This demo API uses simulated payments, so no real card is charged.
                                            Continue to complete your enrollment.
                                        </p>
                                    </div>
                                )}

                                <div className="mb-6 rounded-xl border border-border bg-surface-secondary p-4">
                                    <div className="flex items-center gap-2">
                                        <Lock className="size-4 text-brand-secondary" />
                                        <p className="text-sm text-foreground-secondary">
                                            {hasStripeKey
                                                ? "Secure payment powered by Stripe"
                                                : "Secure test checkout powered by the LearnHub demo API"}
                                        </p>
                                    </div>
                                </div>

                                <CouponInput
                                    courseId={courseId}
                                    onCouponApplied={(coupon, discountedAmount) => {
                                        setAppliedCoupon(coupon);
                                        setDiscountedPrice(discountedAmount);
                                    }}
                                />

                                <button
                                    onClick={handleInitiatePayment}
                                    disabled={createPayment.isPending}
                                    className="mt-6 w-full rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {createPayment.isPending ? "Processing..." : "Continue to Payment"}
                                </button>
                            </div>
                        ) : (
                            <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
                                <div className="mb-6 flex items-center gap-2">
                                    <CreditCard className="size-5 text-brand-secondary" />
                                    <h2 className="text-xl font-semibold text-foreground">
                                        {paymentSession.mode === "demo" ? "Confirm Test Payment" : "Card Details"}
                                    </h2>
                                </div>

                                {paymentSession.mode === "demo" ? (
                                    <DemoPaymentForm
                                        amount={paymentSession.amount}
                                        courseName={course?.name}
                                        isProcessing={createOrder.isPending}
                                        onPay={handleDemoPayment}
                                        onCancel={() => setPaymentSession(null)}
                                    />
                                ) : (
                                    <Elements
                                        stripe={stripePromise}
                                        options={{
                                            clientSecret: paymentSession.clientSecret,
                                            ...options,
                                        }}
                                    >
                                        <PaymentForm
                                            clientSecret={paymentSession.clientSecret}
                                            onSuccess={handlePaymentSuccess}
                                            onCancel={() => setPaymentSession(null)}
                                        />
                                    </Elements>
                                )}
                            </div>
                        )}
                    </div>

                    <div>
                        <CheckoutSummary
                            course={course}
                            appliedCoupon={appliedCoupon}
                            finalPrice={finalPrice}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
