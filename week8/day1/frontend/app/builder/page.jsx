"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import {  useCreateCvMutation } from '../../redux/apiSlice'

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function CvBuilderPage() {
  const { id } = useParams();
  // creating cv button
  const [createCV, { isLoading, isSuccess, isError }] = useCreateCvMutation();

  const handleCreateCV = async () => {
    try {
      await createCV(formData).unwrap();
      alert("CV created successfully!");
    } catch (err) {
      console.error("Failed to create CV", err);
      alert("Error creating CV");
    }
  };  //till here

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

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePersonalChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      personal: { ...prev.personal, [field]: value },
    }));
  };

  const handleCommaInput = (field, value) => {
    const arr = value.split(",").map((v) => v.trim()).filter(Boolean);
    handleFieldChange(field, arr);
  };

  const addEntry = (field, newEntry) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], newEntry],
    }));
  };

  return (
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
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                const localUrl = URL.createObjectURL(file);
                setFormData({ ...formData, photoUrl: localUrl });
              }
            }}
            className="mt-1"
          />
          {formData.photoUrl && (
            <img
              src={formData.photoUrl}
              alt="Profile Preview"
              className="w-24 h-24 mt-2 rounded-full object-cover border"
            />
          )}
        </div>


        {/* PERSONAL INFO */}
        <h3 className="font-semibold">Personal Info</h3>
        {["name", "email", "phone", "address"].map((f) => (
          <input
            key={f}
            className="w-full p-2 border rounded mb-1"
            placeholder={f}
            value={formData.personal[f]}
            onChange={(e) => handlePersonalChange(f, e.target.value)}
          />
        ))}

        {/* SIMPLE COMMA INPUT FIELDS */}
        {[
          "skills",
          "languages",
          "awards",
          "certificates",
          "interests",
        ].map((field) => (
          <input
            key={field}
            className="w-full p-2 border rounded"
            placeholder={`${field} (comma separated)`}
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
        ].map((section) => (
          <div key={section.name} className="border p-2 rounded">
            <h3 className="font-semibold mb-2 capitalize">{section.name}</h3>
            <button
              className="bg-gray-200 px-2 py-1 text-sm rounded mb-2"
              onClick={() =>
                addEntry(
                  section.name,
                  Object.fromEntries(section.fields.map((f) => [f, ""]))
                )
              }
            >
              + Add {section.name.slice(0, -1)}
            </button>

            {formData[section.name].map((entry, idx) => (
              <div key={idx} className="space-y-1 mb-2">
                {section.fields.map((f) => (
                  <input
                    key={f}
                    className="w-full p-1 border rounded text-sm"
                    placeholder={f}
                    value={entry[f]}
                    onChange={(e) => {
                      const updated = [...formData[section.name]];
                      updated[idx][f] = e.target.value;
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
                <h1
                  className="text-3xl font-bold"
                  style={{ color: editorStyle.headingColor }}
                >
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
                    {proj.link && (
                    <a href={proj.link} className="text-blue-500 underline ml-2" target="_blank">
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
         {/* 🆕 CREATE BUTTON */}
      <button
        onClick={handleCreateCV}
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        {isLoading ? "Creating..." : "Create CV"}
      </button>
      </div>
      
    </div>
  );
}
