"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import {  useCreateCvMutation } from '../../redux/apiSlice'


const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });


export default function CvBuilderPage() {
  const { id } = useParams();
  const cvRef = useRef(); // ✅ define cvRef
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

const [pdfURL, setPdfURL] = useState(null);

  const convertColors = (el) => {
    const all = el.querySelectorAll("*");
    all.forEach((node) => {
      const style = window.getComputedStyle(node);
      ["color", "backgroundColor", "borderColor"].forEach((prop) => {
        const val = style[prop];
        if (val?.startsWith("oklch")) node.style[prop] = "#000";
      });
    });
  };

  const handlePreviewPDF = async () => {
     const html2pdf = (await import("html2pdf.js")).default;
    const element = cvRef.current;
    if (!element) return;

    convertColors(element);

    const opt = {
      margin: 0.5,
      filename: "CV.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    html2pdf()
      .set(opt)
      .from(element)
      .toPdf()
      .get("pdf")
      .then((pdf) => {
        const blobUrl = pdf.output("bloburl");
        setPdfURL(blobUrl); // show popup with this URL
      });
  };

  return (
    <div className="flex gap-4 p-4">
      {/* LEFT PANEL — ALL FIELDS */}
      <div className="w-1/4 space-y-4 text-white overflow-y-auto max-h-screen p-2 border border-white/25 rounded">
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
              className="bg-gray-200 text-blue-950 px-2 py-1 text-sm rounded mb-2"
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
      <div  ref={cvRef} id="cv"
        className="w-2/4 border rounded p-6 overflow-y-auto"
        style={{
          backgroundColor: editorStyle.backgroundColor,
          color: editorStyle.color,
          fontSize: editorStyle.fontSize,
          fontFamily: editorStyle.fontFamily,
          width: "210mm",     // A4 width
          minHeight: "297mm", // A4 height
          margin: "auto",
          boxSizing: "border-box",
          padding: "10mm",
          overflowWrap: "break-word",
          wordWrap: "break-word",
          wordBreak: "break-word",
        }}
      >
        {formData.title ? (
          <div className="cv-page" style={{ display: "block" }}>
            {/* HEADER */}
            <div className="flex justify-between items-center mb-6" style={{ pageBreakInside: "avoid" }}>
              <div>
                <h1
                  className="text-3xl font-bold"
                  style={{ color: editorStyle.headingColor }}
                >
                  {formData.title}
                </h1>
                <hr className="mb-2 border-gray-300" />
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

            {/* Sections */}
            {[
              ["Summary", formData.summary && <p>{formData.summary}</p>],
              ["Experience", formData.experience.length > 0 && formData.experience.map((exp, i) => (
                <div key={i} className="mb-2 flex justify-between">
                  <div>
                    <strong>{exp.position}</strong> — {exp.company}
                    {exp.description && <p className="text-sm mt-1">{exp.description}</p>}
                  </div>
                  <div className="text-sm text-right">{exp.startDate} - {exp.endDate}</div>
                </div>
              ))],
              ["Projects", formData.projects.length > 0 && formData.projects.map((proj, i) => (
                <div key={i} className="mb-2 flex justify-between">
                  <div>
                    <strong>{proj.name}</strong>{proj.link && (
                      <a href={proj.link} target="_blank" className="text-blue-500 underline ml-2">
                        Link
                      </a>
                    )}
                    <p>{proj.description}</p> 
                    
                  </div>
                  {proj.link && <div className="text-sm text-right">{proj.link}</div>}
                </div>
              ))],
              ["Education", formData.education.length > 0 && formData.education.map((edu, i) => (
                <div key={i} className="mb-2 flex justify-between">
                  <div>
                    <strong>{edu.degree}</strong> — {edu.institution}
                  </div>
                  <div className="text-sm text-right">{edu.startYear} - {edu.endYear}</div>
                </div>
              ))],
              ["Publications", formData.publications.length > 0 && formData.publications.map((pub, i) => (
                <div key={i} className="mb-2 flex justify-between">
                  <div>{pub.title} — {pub.publisher}</div>
                  <div className="text-sm text-right">{pub.date}</div>
                </div>
              ))],
              
              ["Certifications & Awards", (formData.certificates.length > 0 || formData.awards.length > 0) && (
                <div className="grid grid-cols-2 gap-4">
                  {formData.certificates.length > 0 && (
                    <div>
                      <strong>Certificates:</strong>
                      <hr className="mb-1 border-gray-300" />
                      <ul className="list-disc pl-5">
                        {formData.certificates.map((c, i) => <li key={i}>{c}</li>)}
                      </ul>
                    </div>
                  )}
                  {formData.awards.length > 0 && (
                    <div>
                      <strong>Awards:</strong>
                      <hr className="mb-1 border-gray-300" />
                      <ul className="list-disc pl-5">
                        {formData.awards.map((a, i) => <li key={i}>{a}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              )],
              ["Skills & Languages", (formData.skills.length > 0 || formData.languages.length > 0) && (
                <div className="grid grid-cols-2 gap-4">
                  {formData.skills.length > 0 && (
                    <div>
                      <strong>Skills:</strong>
                      <hr className="mb-1 border-gray-300" />
                      <ul className="list-disc pl-5">
                        {formData.skills.map((skill, i) => (
                          <li key={i}>{skill}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {formData.languages.length > 0 && (
                    <div>
                      <strong>Languages:</strong>
                      <hr className="mb-1 border-gray-300" />
                      <ul className="list-disc pl-5">
                        {formData.languages.map((lang, i) => (
                          <li key={i}>{lang}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )],

              ["Interests", formData.interests.length > 0 && (
                <p>{formData.interests.join(", ")}</p>
              )],
              ["Volunteering", formData.volunteering.length > 0 && formData.volunteering.map((vol, i) => (
                <div key={i} className="mb-2 flex justify-between">
                  <div><strong>{vol.role}</strong> — {vol.organization}</div>
                  <div className="text-sm text-right">{vol.startDate} - {vol.endDate}</div>
                </div>
              ))],
            ].map(([title, content], idx) =>
              content ? (
                <section
                  key={idx}
                  className="mb-4"
                  style={{ pageBreakInside: "avoid", pageBreakAfter: "auto" }}
                >
                  <h2
                    className="text-xl font-semibold mb-1"
                    style={{ color: editorStyle.headingColor }}
                  >
                    {title}
                  </h2>
                  <hr className="mb-2 border-gray-300" />
                  {content}
                </section>
              ) : null
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
       <button
        onClick={handlePreviewPDF}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Preview PDF
      </button>
      {pdfURL && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-3/4 h-5/6 rounded shadow-lg relative flex flex-col">
            <button
              onClick={() => setPdfURL(null)}
              className="absolute top-2 right-2 text-black text-xl"
            >
              ✕
            </button>
            <iframe
              src={pdfURL}
              className="flex-1 w-full rounded-b"
              title="PDF Preview"
            />
            <div className="p-2 border-t flex justify-end">
              <a
                href={pdfURL}
                download="CV.pdf"
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Download
              </a>
            </div>
          </div>
        </div>
      )}
      </div>
      
    </div>
  );
}
