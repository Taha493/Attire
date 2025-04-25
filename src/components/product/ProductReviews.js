// // Update src/components/product/ProductReviews.js
// import React, { useState, useEffect } from "react";
// import { MoreHorizontal, Trash2 } from "lucide-react";
// import { toast } from "react-hot-toast";
// import { productService, authService } from "../../services/api";

// const ProductReviews = ({ productId }) => {
//   const [reviews, setReviews] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [userReview, setUserReview] = useState({
//     rating: 5,
//     text: "",
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [sortBy, setSortBy] = useState("latest");
//   const currentUser = authService.getCurrentUser();

//   // Fetch reviews on component mount
//   useEffect(() => {
//     const fetchReviews = async () => {
//       setLoading(true);
//       try {
//         const reviewsData = await productService.getProductReviews(productId);
//         setReviews(reviewsData);
//       } catch (error) {
//         console.error("Error fetching reviews:", error);
//         toast.error("Failed to load reviews");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchReviews();
//   }, [productId]);

//   // Handle rating selection
//   const handleRatingSelect = (rating) => {
//     setUserReview({ ...userReview, rating });
//   };

//   // Handle review text change
//   const handleReviewTextChange = (e) => {
//     setUserReview({ ...userReview, text: e.target.value });
//   };

//   // Submit review
//   const handleSubmitReview = async (e) => {
//     e.preventDefault();

//     // Check if user is logged in
//     if (!authService.isAuthenticated()) {
//       toast.error("Please sign in to leave a review");
//       return;
//     }

//     // Validate form
//     if (!userReview.text.trim()) {
//       toast.error("Please write a review");
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       const updatedReviews = await productService.addProductReview(
//         productId,
//         userReview
//       );
//       setReviews(updatedReviews);
//       toast.success("Review submitted successfully");

//       // Reset form
//       setUserReview({
//         rating: 5,
//         text: "",
//       });
//     } catch (error) {
//       console.error("Error submitting review:", error);
//       toast.error(error.message || "Failed to submit review");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Delete review
//   const handleDeleteReview = async (reviewId) => {
//     try {
//       await productService.deleteProductReview(productId, reviewId);

//       // Remove from local state
//       setReviews(reviews.filter((review) => review._id !== reviewId));
//       toast.success("Review deleted successfully");
//     } catch (error) {
//       console.error("Error deleting review:", error);
//       toast.error(error.message || "Failed to delete review");
//     }
//   };

//   // Sort reviews based on selected option
//   const sortedReviews = [...reviews].sort((a, b) => {
//     if (sortBy === "latest") {
//       return new Date(b.date) - new Date(a.date);
//     } else if (sortBy === "highest") {
//       return b.rating - a.rating;
//     } else if (sortBy === "lowest") {
//       return a.rating - b.rating;
//     }
//     return 0;
//   });

//   // Render stars based on rating
//   const renderStars = (rating) => {
//     return (
//       <div className="flex">
//         {[...Array(5)].map((_, i) => (
//           <svg
//             key={i}
//             className={`w-4 h-4 ${
//               i < rating ? "text-yellow-400" : "text-gray-300"
//             }`}
//             fill="currentColor"
//             viewBox="0 0 20 20"
//           >
//             <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//           </svg>
//         ))}
//       </div>
//     );
//   };

//   // Format date
//   const formatDate = (dateString) => {
//     const options = { year: "numeric", month: "long", day: "numeric" };
//     return new Date(dateString).toLocaleDateString("en-US", options);
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center py-8">
//         <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black"></div>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
//         <h2 className="font-bold text-xl mb-2 sm:mb-0">
//           Customer Reviews ({reviews.length})
//         </h2>

//         <div className="flex items-center space-x-4">
//           {authService.isAuthenticated() && (
//             <button className="px-4 py-2 border border-black rounded-full text-sm font-medium">
//               Write a Review
//             </button>
//           )}

//           <div className="relative inline-block text-left">
//             <select
//               className="appearance-none border border-gray-300 rounded-full px-4 py-2 bg-white text-sm font-medium focus:outline-none focus:border-black"
//               value={sortBy}
//               onChange={(e) => setSortBy(e.target.value)}
//             >
//               <option value="latest">Latest</option>
//               <option value="highest">Highest Rating</option>
//               <option value="lowest">Lowest Rating</option>
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* Review Form */}
//       {authService.isAuthenticated() && (
//         <form
//           onSubmit={handleSubmitReview}
//           className="mb-8 border-b border-gray-200 pb-6"
//         >
//           <h3 className="font-medium mb-4">Write a Review</h3>

//           {/* Rating Selection */}
//           <div className="mb-4">
//             <label className="block text-sm font-medium mb-1">Rating</label>
//             <div className="flex space-x-2">
//               {[1, 2, 3, 4, 5].map((star) => (
//                 <button
//                   key={star}
//                   type="button"
//                   onClick={() => handleRatingSelect(star)}
//                   className={`text-2xl ${
//                     star <= userReview.rating
//                       ? "text-yellow-400"
//                       : "text-gray-300"
//                   }`}
//                 >
//                   ★
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Review Text */}
//           <div className="mb-4">
//             <label className="block text-sm font-medium mb-1">Review</label>
//             <textarea
//               value={userReview.text}
//               onChange={handleReviewTextChange}
//               placeholder="Share your thoughts about this product..."
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-black focus:border-black"
//               rows="4"
//               required
//             ></textarea>
//           </div>

//           <button
//             type="submit"
//             disabled={isSubmitting}
//             className="bg-black text-white px-6 py-2 rounded-full text-sm font-medium"
//           >
//             {isSubmitting ? (
//               <span className="flex items-center justify-center">
//                 <svg
//                   className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                 >
//                   <circle
//                     className="opacity-25"
//                     cx="12"
//                     cy="12"
//                     r="10"
//                     stroke="currentColor"
//                     strokeWidth="4"
//                   ></circle>
//                   <path
//                     className="opacity-75"
//                     fill="currentColor"
//                     d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                   ></path>
//                 </svg>
//                 Submitting...
//               </span>
//             ) : (
//               "Submit Review"
//             )}
//           </button>
//         </form>
//       )}

//       {/* Reviews List */}
//       {sortedReviews.length > 0 ? (
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {sortedReviews.map((review) => (
//             <div
//               key={review._id}
//               className="border border-gray-200 rounded-lg p-4"
//             >
//               <div className="flex justify-between items-start mb-2">
//                 <div>{renderStars(review.rating)}</div>
//                 {currentUser && currentUser.id === review.user && (
//                   <button
//                     className="text-gray-400 hover:text-red-500"
//                     onClick={() => handleDeleteReview(review._id)}
//                   >
//                     <Trash2 size={16} />
//                   </button>
//                 )}
//               </div>

//               <div className="mb-2">
//                 <h3 className="font-bold">{review.userName}</h3>
//                 <p className="text-xs text-gray-500">
//                   Posted on {formatDate(review.date)}
//                   {review.verified && (
//                     <span className="ml-2 text-green-600 flex items-center text-xs">
//                       <svg
//                         className="w-3 h-3 mr-1"
//                         viewBox="0 0 24 24"
//                         fill="none"
//                         xmlns="http://www.w3.org/2000/svg"
//                       >
//                         <path
//                           d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
//                           fill="currentColor"
//                         />
//                         <path
//                           d="M8 12L10.5 14.5L16 9"
//                           stroke="white"
//                           strokeWidth="2"
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                         />
//                       </svg>
//                       Verified Purchase
//                     </span>
//                   )}
//                 </p>
//               </div>

//               <p className="text-sm text-gray-600">{review.text}</p>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <div className="text-center py-8">
//           <p className="text-gray-500">
//             No reviews yet. Be the first to review this product!
//           </p>
//         </div>
//       )}

//       {/* Load More Button */}
//       {reviews.length > 6 && (
//         <div className="text-center mt-8">
//           <button className="px-6 py-2 border border-gray-300 rounded-full text-sm font-medium hover:bg-gray-50">
//             Load More Reviews
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProductReviews;

import React, { useState, useEffect } from "react";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ProductReviews = ({ productId }) => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userReview, setUserReview] = useState({
    rating: 5,
    text: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sortBy, setSortBy] = useState("latest");
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Simulate authentication
  const currentUser = isAuthenticated
    ? { id: "user123", name: "John Doe" }
    : null; // Mock user

  // Load mock reviews on component mount
  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        // Mock review data
        const mockReviews = [
          {
            _id: "rev1",
            user: "user123",
            userName: "John Doe",
            rating: 5,
            text: "Amazing product! Really comfortable and stylish.",
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            verified: true,
          },
          {
            _id: "rev2",
            user: "user456",
            userName: "Jane Smith",
            rating: 4,
            text: "Good quality, but sizing runs a bit small.",
            date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            verified: true,
          },
          {
            _id: "rev3",
            user: "user789",
            userName: "Mike Johnson",
            rating: 3,
            text: "Decent product, but delivery took longer than expected.",
            date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            verified: false,
          },
        ];

        setReviews(mockReviews);
      } catch (error) {
        console.error("Error loading reviews:", error);
        toast.error("Failed to load reviews");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [productId]);

  // Handle rating selection
  const handleRatingSelect = (rating) => {
    setUserReview({ ...userReview, rating });
  };

  // Handle review text change
  const handleReviewTextChange = (e) => {
    setUserReview({ ...userReview, text: e.target.value });
  };

  // Submit review
  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error("Please sign in to leave a review");
      navigate("/login");
      return;
    }

    if (!userReview.text.trim()) {
      toast.error("Please write a review");
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate review submission
      await new Promise((resolve) => setTimeout(resolve, 500));
      const newReview = {
        _id: `rev${reviews.length + 1}`,
        user: currentUser.id,
        userName: currentUser.name,
        rating: userReview.rating,
        text: userReview.text,
        date: new Date().toISOString(),
        verified: true,
      };

      setReviews([newReview, ...reviews]);
      toast.success("Review submitted successfully");

      // Reset form
      setUserReview({
        rating: 5,
        text: "",
      });
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete review
  const handleDeleteReview = async (reviewId) => {
    if (!isAuthenticated) {
      toast.error("Please sign in to delete a review");
      navigate("/login");
      return;
    }

    try {
      // Simulate review deletion
      await new Promise((resolve) => setTimeout(resolve, 500));
      setReviews(reviews.filter((review) => review._id !== reviewId));
      toast.success("Review deleted successfully");
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error("Failed to delete review");
    }
  };

  // Sort reviews based on selected option
  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortBy === "latest") {
      return new Date(b.date) - new Date(a.date);
    } else if (sortBy === "highest") {
      return b.rating - a.rating;
    } else if (sortBy === "lowest") {
      return a.rating - b.rating;
    }
    return 0;
  });

  // Render stars based on rating
  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${
              i < rating ? "text-yellow-400" : "text-gray-300"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h2 className="font-bold text-xl mb-2 sm:mb-0">
          Customer Reviews ({reviews.length})
        </h2>

        <div className="flex items-center space-x-4">
          {isAuthenticated && (
            <button className="px-4 py-2 border border-black rounded-full text-sm font-medium">
              Write a Review
            </button>
          )}

          <div className="relative inline-block text-left">
            <select
              className="appearance-none border border-gray-300 rounded-full px-4 py-2 bg-white text-sm font-medium focus:outline-none focus:border-black"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="latest">Latest</option>
              <option value="highest">Highest Rating</option>
              <option value="lowest">Lowest Rating</option>
            </select>
          </div>
        </div>
      </div>

      {/* Review Form */}
      {isAuthenticated && (
        <form
          onSubmit={handleSubmitReview}
          className="mb-8 border-b border-gray-200 pb-6"
        >
          <h3 className="font-medium mb-4">Write a Review</h3>

          {/* Rating Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Rating</label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingSelect(star)}
                  className={`text-2xl ${
                    star <= userReview.rating
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          {/* Review Text */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Review</label>
            <textarea
              value={userReview.text}
              onChange={handleReviewTextChange}
              placeholder="Share your thoughts about this product..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-black focus:border-black"
              rows="4"
              required
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-black text-white px-6 py-2 rounded-full text-sm font-medium"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
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
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Submitting...
              </span>
            ) : (
              "Submit Review"
            )}
          </button>
        </form>
      )}

      {/* Reviews List */}
      {sortedReviews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sortedReviews.map((review) => (
            <div
              key={review._id}
              className="border border-gray-200 rounded-lg p-4"
            >
              <div className="flex justify-between items-start mb-2">
                <div>{renderStars(review.rating)}</div>
                {currentUser && currentUser.id === review.user && (
                  <button
                    className="text-gray-400 hover:text-red-500"
                    onClick={() => handleDeleteReview(review._id)}
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              <div className="mb-2">
                <h3 className="font-bold">{review.userName}</h3>
                <p className="text-xs text-gray-500">
                  Posted on {formatDate(review.date)}
                  {review.verified && (
                    <span className="ml-2 text-green-600 flex items-center text-xs">
                      <svg
                        className="w-3 h-3 mr-1"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                          fill="currentColor"
                        />
                        <path
                          d="M8 12L10.5 14.5L16 9"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Verified Purchase
                    </span>
                  )}
                </p>
              </div>

              <p className="text-sm text-gray-600">{review.text}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">
            No reviews yet. Be the first to review this product!
          </p>
        </div>
      )}

      {/* Load More Button (disabled for mock data) */}
      {reviews.length > 6 && (
        <div className="text-center mt-8">
          <button
            className="px-6 py-2 border border-gray-300 rounded-full text-sm font-medium hover:bg-gray-50"
            disabled
          >
            Load More Reviews
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductReviews;
