"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import { useGetCvQuery, useUpdateCvMutation, useUploadPhotoMutation,
  useDeletePhotoMutation, } from '../../../redux/apiSlice';

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function CvEditPage() {
  const params = useParams();
  const id = params?.id;
  console.log("cv id::::", id);

  // 🔹 guard: don't render anything until id exists
  if (!id) return <div className="p-4 text-white">Loading...</div>;

  // Fetch CV data, skip query if id undefined
  const { data: cvData, isLoading, isError } = useGetCvQuery(id, { skip: !id });

  const [formData, setFormData] = useState({
    title: "",
    photoUrl: "",
    personal: { name: "", email: "", phone: "", address: "" },
    education: [],
    experience: [],
    skills: [],
    summary: "",
    languages: [],
    awards: [],
    certificates: [],
    interests: [],
    projects: [],
    publications: [],
    volunteering: [],
  });

  const [editorStyle, setEditorStyle] = useState({
    fontSize: "16px",
    fontFamily: "Arial",
    color: "#000000",
    headingColor: "#1f2937",
    backgroundColor: "#FFFFFF", 
  });
  // Inside CvEditPage
const handleFieldChange = (field, value) => {
  setFormData(prev => ({ ...prev, [field]: value }));
};

const handlePersonalChange = (field, value) => {
  setFormData(prev => ({
    ...prev,
    personal: { ...prev.personal, [field]: value },
  }));
};

const [uploadPhoto] = useUploadPhotoMutation();

const handleUploadPhoto = async (file) => {
  const formData = new FormData();
  formData.append("photo", file);

  try {
    await uploadPhoto({ id: cvData._id, body: formData }).unwrap();
    console.log("Photo uploaded!");
  } catch (error) {
    console.error("Upload failed", error);
  }
};



const handleCommaInput = (field, value) => {
  const arr = value.split(",").map(v => v.trim()).filter(Boolean);
  handleFieldChange(field, arr);
};

const addEntry = (field, newEntry) => {
  setFormData(prev => ({ ...prev, [field]: [...prev[field], newEntry] }));
};

const deleteEntry = (field, idx) => {
  setFormData(prev => ({
    ...prev,
    [field]: prev[field].filter((_, i) => i !== idx),
  }));
};

const handleImageUpload = (file) => {
  if (file) {
    const localUrl = URL.createObjectURL(file);
    setFormData(prev => ({ ...prev, photoUrl: localUrl }));
  }
};

const deleteImage = () => setFormData(prev => ({ ...prev, photoUrl: "" }));

const [updateCv] = useUpdateCvMutation();
const [updating, setUpdating] = useState(false);

const handleUpdateCV = async () => {
  try {
    setUpdating(true); // start loading
    const { _id, id, createdAt, updatedAt, __v, userId, ...rest } = cvData;

    const editableData = {
      ...rest,
      education: (rest.education || []).map(e =>
        typeof e === "string" ? e : `${e.degree} at ${e.institute}`
      ),
      experience: (rest.experience || []).map(e =>
        typeof e === "string" ? e : `${e.role} at ${e.company}`
      ),
      projects: (rest.projects || []).map(p =>
        typeof p === "string" ? p : p.title
      ),
    };

    const result = await updateCv({ id: _id, ...editableData }).unwrap();
    console.log("CV updated successfully!", result);
  } catch (error) {
    console.error("Error updating CV", error);
  } finally {
    setUpdating(false); // stop loading
  }
};

   
  // Populate formData when cvData is loaded
  useEffect(() => {
    if (cvData) {
      const normalize = (arr, fields) =>
        (arr || []).map(item => {
          if (typeof item === "string") {
            // convert string to an object (put it in first field)
            return Object.fromEntries(fields.map((f, i) => [f, i === 0 ? item : ""]));
          }
          if (typeof item === "object" && item !== null) {
            // ensure all fields exist
            return fields.reduce((acc, f) => ({ ...acc, [f]: item[f] || "" }), {});
          }
          return Object.fromEntries(fields.map(f => [f, ""]));
        });

      setFormData({
        ...cvData,
        education: normalize(cvData.education, ["degree", "institution", "startYear", "endYear"]),
        experience: normalize(cvData.experience, ["company", "position", "startDate", "endDate", "description"]),
        projects: normalize(cvData.projects, ["name", "description", "link"]),
        publications: normalize(cvData.publications, ["title", "publisher", "date"]),
        volunteering: normalize(cvData.volunteering, ["organization", "role", "startDate", "endDate"])
      });
    }
  }, [cvData]);


  return (
    <div className="p-4 text-white">
      <h1>CV Editor Loaded!</h1>
      <p>CV Title: {formData.title}</p>
    <div className="flex gap-4 p-4">
      {/* LEFT PANEL — ALL FIELDS */}
      <div className="w-1/4 space-y-4 text-white overflow-y-auto max-h-screen p-2 border rounded">
        <h2 className="text-lg font-bold">CV Fields</h2>

        <input
          className="w-full p-2 border rounded"
          placeholder="Title"
          value={formData.title}
          onChange={(e) => handleFieldChange("title", e.target.value)}
        />

        <div>
          <label className="block text-sm font-medium">Profile Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e.target.files[0])}
            className="mt-1"
          />
          {formData.photoUrl && (
            <div className="relative w-24 h-24 mt-2">
              <img
                src={formData.photoUrl}
                alt="Profile Preview"
                className="w-24 h-24 rounded-full object-cover border"
              />
              <button
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                onClick={deleteImage}
              >
                X
              </button>
            </div>
          )}
        </div>

        {/* PERSONAL INFO */}
        <h3 className="font-semibold">Personal Info</h3>
        {["name", "email", "phone", "address"].map(f => (
          <input
            key={f}
            className="w-full p-2 border rounded mb-1"
            placeholder={f}
            value={formData.personal[f]}
            onChange={(e) => handlePersonalChange(f, e.target.value)}
          />
        ))}

        {/* SIMPLE COMMA INPUT FIELDS */}
        {["skills", "languages", "awards", "certificates", "interests"].map(field => (
          <input
            key={field}
            className="w-full p-2 border rounded"
            placeholder={`${field} (comma separated)`}
            value={formData[field].join(", ")}
            onChange={(e) => handleCommaInput(field, e.target.value)}
          />
        ))}

        <textarea
          className="w-full p-2 border rounded"
          placeholder="Summary"
          value={formData.summary}
          onChange={(e) => handleFieldChange("summary", e.target.value)}
        />

        {/* DYNAMIC ENTRY FIELDS */}
        {[
          { name: "education", fields: ["degree", "institution", "startYear", "endYear"] },
          { name: "experience", fields: ["company", "position", "startDate", "endDate", "description"] },
          { name: "projects", fields: ["name", "description", "link"] },
          { name: "publications", fields: ["title", "publisher", "date"] },
          { name: "volunteering", fields: ["organization", "role", "startDate", "endDate"] },
        ].map(section => (
          <div key={section.name} className="border p-2 rounded">
            <h3 className="font-semibold mb-2 capitalize">{section.name}</h3>
            <button
              className="bg-gray-200 px-2 py-1 text-sm rounded mb-2"
              onClick={() =>
                addEntry(
                  section.name,
                  Object.fromEntries(section.fields.map(f => [f, ""]))
                )
              }
            >
              + Add {section.name.slice(0, -1)}
            </button>

            {formData[section.name].map((entry, idx) => (
              <div key={idx} className="space-y-1 mb-2 relative">
                <button
                  className="absolute top-0 right-0 bg-red-500 text-white rounded px-1 text-xs"
                  onClick={() => deleteEntry(section.name, idx)}
                >
                  Delete
                </button>
                {section.fields.map(f => (
                  <input
                    key={f}
                    value={entry[f] ?? ""}
                    onChange={(e) => {
                      const updated = [...formData[section.name]];
                      updated[idx][f] = e.target.value;  // ❌ breaks if updated[idx] is a string
                      handleFieldChange(section.name, updated);
                    }}
                  />
                ))}

              </div>
            ))}
          </div>
        ))}
      </div>

      {/* MIDDLE PREVIEW */}
      <div
        className="w-2/4 border rounded p-6 min-h-screen overflow-y-auto"
        style={{
          backgroundColor: editorStyle.backgroundColor,
          color: editorStyle.color,
          fontSize: editorStyle.fontSize,
          fontFamily: editorStyle.fontFamily,
        }}
      >
        {formData.title ? (
          <div>
            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold" style={{ color: editorStyle.headingColor }}>
                  {formData.title}
                </h1>
                <p>{formData.personal.name}</p>
                <p>{formData.personal.email}</p>
                <p>{formData.personal.phone}</p>
                <p>{formData.personal.address}</p>
              </div>
              {formData.photoUrl && (
                <img
                  src={formData.photoUrl}
                  alt="Profile"
                  className="w-28 h-28 object-cover rounded-full border"
                />
              )}
            </div>
            <hr />

            {/* OTHER SECTIONS */}
            {formData.summary && (
              <section>
                <h2 className="text-xl font-semibold" style={{ color: editorStyle.headingColor }}>
                  Summary
                </h2>
                <p>{formData.summary}</p>
              </section>
            )}

            {formData.skills.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold" style={{ color: editorStyle.headingColor }}>
                  Skills
                </h2>
                <ul className="list-disc pl-5">
                  {formData.skills.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </section>
            )}

            {/* EDUCATION */}
            {formData.education.length > 0 && (
              <section className="mt-4">
                <h2 className="text-xl font-semibold" style={{ color: editorStyle.headingColor }}>
                  Education
                </h2>
                <ul className="list-disc pl-5">
                  {formData.education.map((edu, i) => (
                    <li key={i}>
                      <strong>{edu.degree}</strong> — {edu.institution} ({edu.startYear} - {edu.endYear})
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* EXPERIENCE */}
            {formData.experience.length > 0 && (
              <section className="mt-4">
                <h2 className="text-xl font-semibold" style={{ color: editorStyle.headingColor }}>
                  Experience
                </h2>
                {formData.experience.map((exp, i) => (
                  <div key={i} className="mb-2">
                    <strong>{exp.position}</strong> — {exp.company} ({exp.startDate} - {exp.endDate})
                    <p className="text-sm">{exp.description}</p>
                  </div>
                ))}
              </section>
            )}

            {/* PROJECTS */}
            {formData.projects.length > 0 && (
              <section className="mt-4">
                <h2 className="text-xl font-semibold" style={{ color: editorStyle.headingColor }}>
                  Projects
                </h2>
                {formData.projects.map((proj, i) => (
                  <div key={i} className="mb-2">
                    <strong>{proj.name}</strong> — {proj.description}
                    {typeof proj.link === "string" && proj.link.trim() !== "" && (
                      <a
                        href={proj.link}
                        className="text-blue-500 underline ml-2"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Link
                      </a>
                    )}
                  </div>
                ))}
              </section>
            )}

            {/* PUBLICATIONS */}
            {formData.publications.length > 0 && (
              <section className="mt-4">
                <h2 className="text-xl font-semibold" style={{ color: editorStyle.headingColor }}>
                  Publications
                </h2>
                <ul className="list-disc pl-5">
                  {formData.publications.map((pub, i) => (
                    <li key={i}>
                      {pub.title} — {pub.publisher} ({pub.date})
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* VOLUNTEERING */}
            {formData.volunteering.length > 0 && (
              <section className="mt-4">
                <h2 className="text-xl font-semibold" style={{ color: editorStyle.headingColor }}>
                  Volunteering
                </h2>
                {formData.volunteering.map((vol, i) => (
                  <div key={i}>
                    <strong>{vol.role}</strong> — {vol.organization} ({vol.startDate} - {vol.endDate})
                  </div>
                ))}
              </section>
            )}

            {/* LANGUAGES */}
            {formData.languages.length > 0 && (
              <section className="mt-4">
                <h2 className="text-xl font-semibold" style={{ color: editorStyle.headingColor }}>
                  Languages
                </h2>
                <p>{formData.languages.join(", ")}</p>
              </section>
            )}

            {/* AWARDS */}
            {formData.awards.length > 0 && (
              <section className="mt-4">
                <h2 className="text-xl font-semibold" style={{ color: editorStyle.headingColor }}>
                  Awards
                </h2>
                <ul className="list-disc pl-5">
                  {formData.awards.map((a, i) => <li key={i}>{a}</li>)}
                </ul>
              </section>
            )}

            {/* CERTIFICATES */}
            {formData.certificates.length > 0 && (
              <section className="mt-4">
                <h2 className="text-xl font-semibold" style={{ color: editorStyle.headingColor }}>
                  Certificates
                </h2>
                <ul className="list-disc pl-5">
                  {formData.certificates.map((c, i) => <li key={i}>{c}</li>)}
                </ul>
              </section>
            )}

            {/* INTERESTS */}
            {formData.interests.length > 0 && (
              <section className="mt-4">
                <h2 className="text-xl font-semibold" style={{ color: editorStyle.headingColor }}>
                  Interests
                </h2>
                <p>{formData.interests.join(", ")}</p>
              </section>
            )}
          </div>
        ) : (
          <div className="text-gray-500 text-center mt-20">
            Start adding fields to preview your CV
          </div>
        )}
      </div>

      {/* RIGHT PANEL — EDITOR STYLING */}
      <div className="w-1/4 space-y-4 border rounded p-2 text-white">
        <h2 className="font-bold text-lg">Editor</h2>
        <label className="block">
          Font Size
          <input
            type="number"
            className="w-full p-2 border rounded"
            value={parseInt(editorStyle.fontSize)}
            onChange={(e) =>
              setEditorStyle((p) => ({ ...p, fontSize: e.target.value + "px" }))
            }
          />
        </label>
        <label className="block">
          Font Family
          <select
            className="w-full p-2 border rounded"
            value={editorStyle.fontFamily}
            onChange={(e) =>
              setEditorStyle((p) => ({ ...p, fontFamily: e.target.value }))
            }
          >
            <option>Arial</option>
            <option>Times New Roman</option>
            <option>Courier New</option>
          </select>
        </label>
        <label className="block">
          Text Color
          <input
            type="color"
            className="w-full h-10"
            value={editorStyle.color}
            onChange={(e) =>
              setEditorStyle((p) => ({ ...p, color: e.target.value }))
            }
          />
        </label>
        <label className="block">
          Heading Color
          <input
            type="color"
            className="w-full h-10"
            value={editorStyle.headingColor}
            onChange={(e) =>
              setEditorStyle((p) => ({ ...p, headingColor: e.target.value }))
            }
          />
        </label>
        <label className="block">
          Background Color
          <input
            type="color"
            className="w-full h-10"
            value={editorStyle.backgroundColor}
            onChange={(e) =>
              setEditorStyle((p) => ({ ...p, backgroundColor: e.target.value }))
            }
          />
        </label>

        {/* 🆕 UPDATE BUTTON */}
        <button
          onClick={handleUpdateCV}
          disabled={updating}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {updating ? "Updating..." : "Update CV"}
        </button>
      </div>
    </div>
    </div>
  );
}
