"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Image from "next/image";

interface OrderItem {
  id: string;
  quantity: number;
  size?: string;
  product: {
    id: string;
    name: string;
    price: number;
    images: { url: string }[];
  };
}

interface Order {
  id: string;
  orderItems: OrderItem[];
}

interface Review {
  rating: number;
  comment: string;
  productId: string;
}

interface ReviewModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
  onReviewsSubmitted: () => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({
  order,
  isOpen,
  onClose,
  onReviewsSubmitted,
}) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [animateModal, setAnimateModal] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Initialize reviews for all products in the order
      const initialReviews = order.orderItems.map((item) => ({
        rating: 5,
        comment: "",
        productId: item.product.id,
      }));
      setReviews(initialReviews);
      setSubmitStatus("idle");
      setTimeout(() => setAnimateModal(true), 50);
    } else {
      setAnimateModal(false);
    }
  }, [isOpen, order]);

  const updateReview = (
    productId: string,
    field: "rating" | "comment",
    value: any
  ) => {
    setReviews((prev) =>
      prev.map((review) =>
        review.productId === productId ? { ...review, [field]: value } : review
      )
    );
  };

  const submitReviews = async () => {
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const token =
        localStorage.getItem("token") || localStorage.getItem("accessToken");

      if (!token) {
        throw new Error("Please log in to submit reviews");
      }

      // Submit each review
      for (const review of reviews) {
        const response = await axios.post(
          "/api/reviews",
          {
            orderId: order.id,
            productId: review.productId,
            rating: review.rating,
            comment: review.comment.trim() || null,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.data.success) {
          throw new Error(response.data.error || "Failed to submit review");
        }
      }

      setSubmitStatus("success");
      toast.success("All reviews submitted successfully!");
      onReviewsSubmitted();

      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (error: any) {
      console.error("Error submitting reviews:", error);
      setSubmitStatus("error");
      toast.error(error.message || "Failed to submit reviews");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setAnimateModal(false);
    setTimeout(() => {
      onClose();
      setReviews([]);
      setSubmitStatus("idle");
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-[9999999] p-0 md:p-4 transition-opacity duration-300 ${
        animateModal ? "opacity-100" : "opacity-0"
      }`}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        className={`bg-white rounded-none md:rounded-2xl w-full h-full md:max-w-2xl md:w-auto md:h-auto md:max-h-[90vh] shadow-2xl transform transition-all duration-300 overflow-y-auto ${
          animateModal
            ? "translate-y-0 scale-100 opacity-100"
            : "translate-y-8 scale-95 opacity-0"
        }`}
      >
        {/* Header */}
        <div className="relative px-4 py-6 md:px-8 pt-8 md:pt-6 border-b border-gray-100">
          <div className="absolute top-8 md:top-6 right-4 md:right-6">
            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-200 group"
            >
              <svg
                className="w-4 h-4 text-gray-500 group-hover:text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#3474c0] via-[#4fb3e5] to-[#3474c0] mb-2">
              Leave a Review
            </h2>
            <div className="bg-gradient-to-r from-[#3474c0]/10 via-[#4fb3e5]/10 to-[#3474c0]/10 rounded-lg px-4 py-2 inline-block">
              <p className="text-sm font-medium text-gray-700">
                Order #{order.id.slice(-8).toUpperCase()}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 py-6 md:px-8">
          {submitStatus === "success" ? (
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Thank You!
              </h3>
              <p className="text-gray-600 mb-4">
                Your reviews have been submitted successfully. They help other
                customers make informed decisions!
              </p>
              <div className="text-sm text-gray-500">
                Closing automatically...
              </div>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <p className="text-gray-600 leading-relaxed text-center">
                  Thank you for your purchase! Please share your experience with
                  these products to help other customers.
                </p>
              </div>

              {submitStatus === "error" && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 text-red-600 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-sm font-medium text-red-800">
                      Failed to submit reviews. Please try again.
                    </span>
                  </div>
                </div>
              )}

              <div className="space-y-6">
                {order.orderItems.map((item, index) => (
                  <div
                    key={item.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-start space-x-4 mb-4">
                      <Image
                        src={
                          item.product.images?.[0]?.url ||
                          "/placeholder-image.jpg"
                        }
                        alt={item.product.name}
                        width={64}
                        height={64}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">
                          {item.product.name}
                        </h3>
                        {item.size && (
                          <p className="text-sm text-gray-500">
                            Size: {item.size}
                          </p>
                        )}
                        <p className="text-sm text-gray-500">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                    </div>

                    {/* Star Rating */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rating *
                      </label>
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() =>
                              updateReview(item.product.id, "rating", star)
                            }
                            className={`p-1 transition-colors duration-200 ${
                              star <= (reviews[index]?.rating || 0)
                                ? "text-yellow-400 hover:text-yellow-500"
                                : "text-gray-300 hover:text-yellow-400"
                            }`}
                          >
                            {star <= (reviews[index]?.rating || 0) ? (
                              <svg
                                className="w-6 h-6"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                              </svg>
                            ) : (
                              <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                                />
                              </svg>
                            )}
                          </button>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {reviews[index]?.rating === 1 && "Poor"}
                        {reviews[index]?.rating === 2 && "Fair"}
                        {reviews[index]?.rating === 3 && "Good"}
                        {reviews[index]?.rating === 4 && "Very Good"}
                        {reviews[index]?.rating === 5 && "Excellent"}
                      </p>
                    </div>

                    {/* Comment */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Comment (Optional)
                      </label>
                      <textarea
                        value={reviews[index]?.comment || ""}
                        onChange={(e) =>
                          updateReview(
                            item.product.id,
                            "comment",
                            e.target.value
                          )
                        }
                        placeholder="Share your thoughts about this product..."
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3474c0] focus:border-transparent resize-none"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Help other customers by sharing your experience!
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-6 md:px-8 bg-gray-50 rounded-b-none md:rounded-b-2xl">
          {submitStatus !== "success" && (
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleClose}
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-100 hover:border-gray-300 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={submitReviews}
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-[#3474c0] text-white rounded-xl hover:bg-[#2a5a9e] hover:shadow-lg hover:scale-105 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Submitting...
                  </div>
                ) : (
                  "Submit Reviews"
                )}
              </button>
            </div>
          )}

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              Thank you for choosing Shopssentials!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
