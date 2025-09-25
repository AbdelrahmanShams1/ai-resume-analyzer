import { Link } from "react-router";
import ScoreCircle from "./ScoreCircle";
import { useEffect, useState } from "react";
import { usePuterStore } from "~/lib/Puter";

const ResumeCard = ({
  resume: { id, companyName, jobTitle, feedBack, imagePath },
}: {
  resume: Resume;
}) => {
  const [imageUrl, setImageUrl] = useState("");
  const { auth, fs } = usePuterStore();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    const loadResume = async () => {
      const ImageBlob = await fs.read(imagePath);
      if (!ImageBlob) return;
      const img = URL.createObjectURL(ImageBlob);
      setImageUrl(img);
      setLoading(true);
    };
    loadResume();
  }, [imagePath]);
  return (
    <Link
      to={`/resume/${id}`}
      className="resume-card animate-in fade-in duration-1000"
    >
      <div className="resume-card-header">
        <div className="flex flex-col gap-2 text-center md:text-start">
          {companyName && (
            <h2 className="!text-black font-bold break-words">{companyName}</h2>
          )}
          {jobTitle && (
            <h3 className="text-lg break-words text-gray-500">{jobTitle}</h3>
          )}
          {!companyName && !jobTitle && (
            <h2 className="!text-black font-bold">Resume</h2>
          )}
        </div>
        <div className="flex-shrink-0">
          <ScoreCircle score={feedBack.overallScore} />
        </div>
      </div>
      {imageUrl && (
        <div className="gradient-border animate-in fade-in duration-1000">
          <div className="w-full h-full">
            <img
              src={imageUrl}
              alt="resume"
              className="w-full h-[350px] max-sm:h-[200px] object-cover object-top"
            />
          </div>
        </div>
      )}
    </Link>
  );
};

export default ResumeCard;
