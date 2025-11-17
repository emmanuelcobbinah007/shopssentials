"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  user: {
    firstname: string;
    lastname: string;
    profilePicture?: string;
  };
}

interface ProductReviewsPageProps {
  params: Promise<{
    productId: string;
  }>;
}

const ProductReviewsPage: React.FC<ProductReviewsPageProps> = ({ params }) => {
  const [productId, setProductId] = useState<string>("");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [totalReviews, setTotalReviews] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const reviewsPerPage = 10;

  const searchParams = useSearchParams();

  // Unwrap params promise
  useEffect(() => {
    params.then((p) => setProductId(p.productId));
  }, [params]);

  // Get page from URL params
  useEffect(() => {
    const page = searchParams.get("page");
    if (page) {
      setCurrentPage(parseInt(page, 10));
    }
  }, [searchParams]);

  const fetchReviews = React.useCallback(
    async (page: number = 1) => {
      if (!productId) return;

      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(
          `/api/reviews?productId=${productId}&page=${page}&limit=${reviewsPerPage}`
        );

        if (response.data.success) {
          const reviewsData = response.data.reviews as Review[];
          setReviews(reviewsData);
          setTotalReviews(response.data.totalReviews || reviewsData.length);
          setTotalPages(
            Math.ceil(
              (response.data.totalReviews || reviewsData.length) /
                reviewsPerPage
            )
          );

          if (reviewsData.length > 0) {
            const totalRating = reviewsData.reduce(
              (sum: number, review: Review) => sum + review.rating,
              0
            );
            setAverageRating(totalRating / reviewsData.length);
          } else {
            setAverageRating(0);
          }
        } else {
          setError(response.data.error || "Failed to load reviews");
        }
      } catch (err: unknown) {
        console.error("Error fetching reviews:", err);
        setError("Failed to load reviews");
      } finally {
        setLoading(false);
      }
    },
    [productId]
  );

  useEffect(() => {
    if (productId) {
      fetchReviews(currentPage);
    }
  }, [productId, currentPage, fetchReviews]);

  const renderStars = (rating: number, size: "sm" | "md" | "lg" = "md") => {
    const sizeClasses = {
      sm: "w-4 h-4",
      md: "w-5 h-5",
      lg: "w-6 h-6",
    };

    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`${sizeClasses[size]} ${
              star <= rating ? "text-yellow-400" : "text-gray-300"
            }`}
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        ))}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getFullName = (user: { firstname: string; lastname: string }) => {
    return `${user.firstname} ${user.lastname}`.trim();
  };

  const getAnonymizedName = (user: { firstname: string; lastname: string }) => {
    const fullName = getFullName(user);
    const names = fullName.split(" ");
    if (names.length >= 2) {
      const firstName = names[0];
      const lastName = names[names.length - 1];
      return `${firstName} ${lastName.charAt(0)}***`;
    }
    return `${names[0]}***`;
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Update URL
    const url = new URL(window.location.href);
    url.searchParams.set("page", page.toString());
    window.history.pushState({}, "", url.toString());
  };

  if (loading && reviews.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <svg
              className="w-16 h-16 mx-auto text-gray-400 mb-4"
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
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Error Loading Reviews
            </h2>
            <p className="text-gray-500 mb-6">{error}</p>
            <Link
              href={`/product/${productId}`}
              className="inline-flex items-center text-[#3474c0] hover:text-[#2a5a9a] font-medium"
            >
              ← Back to Product
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Customer Reviews
            </h1>
            <Link
              href={`/product/${productId}`}
              className="inline-flex items-center text-[#3474c0] hover:text-[#2a5a9a] font-medium"
            >
              ← Back to Product
            </Link>
          </div>

          {totalReviews > 0 ? (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {renderStars(Math.round(averageRating), "lg")}
                <span className="text-xl font-semibold text-gray-800">
                  {averageRating.toFixed(1)}
                </span>
              </div>
              <span className="text-gray-600">
                Based on {totalReviews} review{totalReviews !== 1 ? "s" : ""}
              </span>
            </div>
          ) : (
            <div className="text-center py-12">
              <svg
                className="w-20 h-20 mx-auto text-gray-300 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                No Reviews Yet
              </h2>
              <p className="text-gray-500">
                Be the first to share your thoughts about this product!
              </p>
            </div>
          )}
        </div>

        {/* Reviews List */}
        {reviews.length > 0 && (
          <>
            <div className="space-y-6 mb-8">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm"
                >
                  <div className="flex items-start space-x-4">
                    {/* User Avatar */}
                    <div className="flex-shrink-0">
                      {review.user.profilePicture ? (
                        <Image
                          src={review.user.profilePicture}
                          alt={getFullName(review.user)}
                          width={48}
                          height={48}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-[#3474c0] rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-semibold">
                            {getInitials(getFullName(review.user))}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Review Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-base font-semibold text-gray-900">
                          {getAnonymizedName(review.user)}
                        </h3>
                        <span className="text-sm text-gray-500">
                          {formatDate(review.createdAt)}
                        </span>
                      </div>

                      <div className="mb-3">
                        {renderStars(review.rating, "md")}
                      </div>

                      {review.comment && (
                        <p className="text-gray-700 leading-relaxed">
                          {review.comment}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-2 text-sm font-medium rounded-md ${
                        page === currentPage
                          ? "text-white bg-[#3474c0] border-[#3474c0]"
                          : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProductReviewsPage;
