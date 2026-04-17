import { UploadCloudIcon } from "lucide-react";

function ResumeUpload({ onUpload, isUploading, resume }) {
  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      onUpload(file);
      event.target.value = "";
    }
  };

  return (
    <div className="card" data-reveal>
      <div className="card-body">
        <h2 className="text-2xl font-black">Upload Resume</h2>
        <p className="text-sm opacity-70">PDF only. We will parse skills and projects.</p>

        <label className="btn btn-primary w-fit mt-4" data-ripple>
          <UploadCloudIcon className="size-4" />
          <span>{isUploading ? "Uploading..." : "Choose PDF"}</span>
          <input
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </label>

        {resume && (
          <div className="mt-6 space-y-3">
            <div>
              <p className="font-semibold">Skills</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {resume.skills?.length ? (
                  resume.skills.map((skill) => (
                    <span key={skill} className="ca-chip">
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-sm opacity-60">No skills detected</span>
                )}
              </div>
            </div>

            <div>
              <p className="font-semibold">Tech Stack</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {resume.techStack?.length ? (
                  resume.techStack.map((tech) => (
                    <span key={tech} className="ca-chip">
                      {tech}
                    </span>
                  ))
                ) : (
                  <span className="text-sm opacity-60">No tech stack detected</span>
                )}
              </div>
            </div>

            <div>
              <p className="font-semibold">Projects</p>
              <ul className="list-disc list-inside text-sm opacity-80 mt-2 space-y-1">
                {resume.projects?.length ? (
                  resume.projects.map((project) => <li key={project}>{project}</li>)
                ) : (
                  <li className="text-sm opacity-60">No projects detected</li>
                )}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResumeUpload;
