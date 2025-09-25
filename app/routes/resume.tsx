import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import ATS from "~/component/ATS";
import Details from "~/component/details";
import Summary from "~/component/summary";
import { usePuterStore } from "~/lib/Puter";
import { useAuthRedirect } from "~/lib/utilis";

export const meta = () => [
  { title: "Resumind | Review " },
  { name: "description", content: "Detailed overview of your resume" },
];

const resume = () => {
  const { auth, isLoading, fs, kv, ai } = usePuterStore();
  const { id } = useParams();
  const [resumeUrl, setResumeUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [feedBack, setFeedBack] = useState<Feedback | null>(null);

  useAuthRedirect([!auth.isAuthenticated], `/auth?next=/resume/${id}`, [
    !isLoading,
  ]);

  useEffect(() => {
    const fetchData = async () => {
      const resume = await kv.get(`resume:${id}`);
      if (!resume) return;
      const data = JSON.parse(resume);

      const resumeBolB = await fs.read(data.resumePath);
      if (!resumeBolB) return;
      const pdfBlob = new Blob([resumeBolB], { type: "application/pdf" });
      const resumeUrl = URL.createObjectURL(pdfBlob);
      setResumeUrl(resumeUrl);

      const imageBlob = await fs.read(data.imagePath);
      if (!imageBlob) return;
      const imageUrl = URL.createObjectURL(imageBlob);
      setImageUrl(imageUrl);
      setFeedBack(data.feedBack);
    };
    fetchData();
  }, [id]);

  return (
    <main className="!pt-0">
      <nav className="resume-nav">
        <Link to="/" className="back-button">
          <img src="/icons/back.svg" alt="logo" className="w-2.5 h-2.5" />
          <span className="text-gray-800 text-sm font-semibold">
            Back to Homepage
          </span>
        </Link>
      </nav>
      <div className="flex flex-row w-full max-lg:flex-col-reverse">
        <section className="feedback-section bg-[url('images/bg-small.svg') bg-cover h-[100vh] sticky top-0 items-center justify-center">
          {imageUrl && resumeUrl && (
            <div className="animate-in fade-in duration-1000 gradient-border max-sm:m-0 h-[90%] max-xl:h-fit w-fit">
              <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                <img
                  src={imageUrl}
                  className="w-full h-full object-contain rounded-2xl"
                  title="resume"
                />
              </a>
            </div>
          )}
        </section>
        <section className="feedback-section">
          <h2 className="text-4xl !text-black font-bold">Resume Review</h2>
          {feedBack ? (
            <div className="flex flex-col gap-8 animate-in fade-in duration-1000">
              <Summary feedBack={feedBack} />
              <ATS
                score={feedBack.ATS.score || 0}
                suggestions={feedBack.ATS.tips || []}
              />
              <Details feedback={feedBack} />
            </div>
          ) : (
            <img src="/images/resume-scan-2.gif" className="w-full" />
          )}
        </section>
      </div>
    </main>
  );
};

export default resume;
