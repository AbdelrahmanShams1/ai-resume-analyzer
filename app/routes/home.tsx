import Navbar from "~/component/Navbar";
import type { Route } from "./+types/home";
import ResumeCard from "~/component/ResumeCard";
import { usePuterStore } from "~/lib/Puter";
import { useAuthRedirect } from "~/lib/utilis";
import { useEffect, useState } from "react";
import { Link } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumind" },
    { name: "description", content: "Smart feedback for your dream job!" },
  ];
}

export default function Home() {
  const { auth, kv } = usePuterStore();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(false);
  useAuthRedirect([!auth.isAuthenticated], "/auth?next=/", [
    auth.isAuthenticated,
  ]);

  useEffect(() => {
    setLoading(true);
    const fetchResumes = async () => {
      const res = (await kv.list(`resume:*`, true)) as KVItem[];
      if (res?.length === 0) {
        setLoading(false);
        return;
      }
      const resume = res.map((resume) => JSON.parse(resume.value) as Resume);
      setResumes(resume || []);
      setLoading(false);
    };

    fetchResumes();
  }, []);

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />

      <section className="main-section">
        <div className="page-heading py-16">
          <h1>Track Your Applications & Resume Ratings</h1>
          {!loading && resumes.length === 0 ? (
            <h2>No Found Resumes </h2>
          ) : (
            <h2>Review your submissions and check AI-powered feedback.</h2>
          )}
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center">
            <img src="/images/resume-scan-2.gif" className="w-[200px]" />
          </div>
        )}

        {!loading && resumes.length > 0 && (
          <div className="resumes-section">
            {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
          </div>
        )}

        {!loading && resumes?.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-10 gap-4">
            <Link
              to="/upload"
              className="primary-button w-fit text-xl font-semibold"
            >
              Upload Resume
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
