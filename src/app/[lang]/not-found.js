import NotFound from "@/components/notfound/NotFound";

// Galat / purana link → 404 (Google index nahi karta)
export const metadata = {
  title: "पेज नहीं मिला · Page not found",
  robots: { index: false, follow: true },
};

export default function NotFoundPage() {
  return <NotFound />;
}
