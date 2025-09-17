"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import {
  useGetCvQuery,
  useUpdateCvMutation,
  useUploadPhotoMutation,
  useDeletePhotoMutation,
} from "../../../redux/apiSlice";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function CvEditPage() {
  const params = useParams();
  const id = params?.id;
  console.log("cv id::::", id);

  if (!id) return <div className="p-4 text-white">Loading...</div>;

  const { data: cvData, isLoading, isError } = useGetCvQuery(id, { skip: !id });

  // Controlled local form state
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

  // RTK Query mutations (use returned isLoading for button state)
  const [updateCv, { isLoading: updating }] = useUpdateCvMutation();
  const [uploadPhoto] = useUploadPhotoMutation();
  const [deletePhoto] = useDeletePhotoMutation();

  // Helper: parse a string entry into an object for given fields
  const parseStringToObject = (str = "", fields = []) => {
    // sanitize "undefined" artifacts
    const cleaned = String(str).replace(/\bundefined\b/gi, "").trim();

    if (!cleaned) {
      return Object.fromEntries(fields.map((f) => [f, ""]));
    }

    // if contains " at " (our previous format), split into first two fields
    if (cleaned.includes(" at ")) {
      const [left, right] = cleaned.split(" at ").map((s) => s.trim());
      return fields.reduce((acc, f, i) => {
        if (i === 0) acc[f] = left || "";
        else if (i === 1) acc[f] = right || "";
        else acc[f] = "";
        return acc;
      }, {});
    }

    // fallback: place the whole string into the first field
    return fields.reduce((acc, f, i) => ({ ...acc, [f]: i === 0 ? cleaned : "" }), {});
  };

  // Normalize arrays coming from backend so every item is an object with specified fields
  const normalize = (arr, fields) =>
    (arr || []).map((item) => {
      if (typeof item === "string") return parseStringToObject(item, fields);
      if (item && typeof item === "object") {
        // ensure all fields exist and convert numbers to string for inputs if needed
        return fields.reduce(
          (acc, f) => ({ ...acc, [f]: item[f] !== undefined && item[f] !== null ? item[f] : "" }),
          {}
        );
      }
      // default
      return Object.fromEntries(fields.map((f) => [f, ""]));
    });

  // When we receive cvData, seed/normalize formData once
  useEffect(() => {
    if (!cvData) return;

    setFormData((prev) => ({
      ...prev,
      // keep form fields in expected structure
      title: cvData.title ?? "",
      photoUrl: cvData.photoUrl ?? "",
      personal: {
        ...(prev.personal || {}),
        ...(cvData.personal || {}),
      },
      skills: Array.isArray(cvData.skills) ? cvData.skills : [],
      summary: cvData.summary ?? "",
      languages: Array.isArray(cvData.languages) ? cvData.languages : [],
      awards: Array.isArray(cvData.awards) ? cvData.awards : [],
      certificates: Array.isArray(cvData.certificates) ? cvData.certificates : [],
      interests: Array.isArray(cvData.interests) ? cvData.interests : [],

      // dynamic sections normalized to object arrays
      education: normalize(cvData.education, ["degree", "institution", "startYear", "endYear"]),
      experience: normalize(cvData.experience, [
        "company",
        "position",
        "startDate",
        "endDate",
        "description",
      ]),
      projects: normalize(cvData.projects, ["name", "description", "link"]),
      publications: normalize(cvData.publications, ["title", "publisher", "date"]),
      volunteering: normalize(cvData.volunteering, ["organization", "role", "startDate", "endDate"]),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cvData]);

  // Basic handlers
  const handleFieldChange = (field, value) => {
    setFormData((p) => ({ ...p, [field]: value }));
  };

  const handlePersonalChange = (field, value) => {
    setFormData((p) => ({ ...p, personal: { ...p.personal, [field]: value } }));
  };

  const handleCommaInput = (field, value) => {
    const arr = value.split(",").map((v) => v.trim()).filter(Boolean);
    handleFieldChange(field, arr);
  };

  const addEntry = (field, newEntry) => {
    setFormData((p) => ({ ...p, [field]: [...(p[field] || []), newEntry] }));
  };

  const deleteEntry = (field, idx) => {
    setFormData((p) => ({ ...p, [field]: p[field].filter((_, i) => i !== idx) }));
  };

  // handle local preview image (object URL). Use uploadPhoto to persist.
  const handleImageUpload = (file) => {
    if (!file) return;
    const localUrl = URL.createObjectURL(file);
    setFormData((p) => ({ ...p, photoUrl: localUrl }));

    // upload to backend and update stored URL
    const fd = new FormData();
    fd.append("file", file); // your backend expects 'file' per your controller
    uploadPhoto({ id, body: fd })
      .unwrap()
      .then((res) => {
        // res should include photoUrl
        if (res?.photoUrl) setFormData((p) => ({ ...p, photoUrl: res.photoUrl }));
      })
      .catch((err) => {
        console.error("Upload failed", err);
      });
  };

  const handleDeletePhoto = async () => {
    try {
      await deletePhoto(id).unwrap();
      setFormData((p) => ({ ...p, photoUrl: "" }));
    } catch (err) {
      console.error("Delete photo failed", err);
    }
  };

  // Dynamic-field onChange helper (ensures the entry at idx is an object)
  const handleDynamicChange = (sectionName, idx, fieldKey, value, fieldDefs) => {
    setFormData((p) => {
      const arr = Array.isArray(p[sectionName]) ? [...p[sectionName]] : [];
      let item = arr[idx];

      if (typeof item === "string") {
        // convert string to object before mutating
        item = parseStringToObject(item, fieldDefs);
      } else if (!item || typeof item !== "object") {
        item = Object.fromEntries(fieldDefs.map((f) => [f, ""]));
      }

      item = { ...item, [fieldKey]: value };
      arr[idx] = item;
      return { ...p, [sectionName]: arr };
    });
  };

  // Submit update: send `formData` (trim internal-only props if any)
  const handleUpdateCV = async () => {
    try {
      // build payload from formData; backend expects arrays of objects for detailed fields
      const payload = {
        ...formData,
      };

      // strip any unexpected fields (safety)
      delete payload._id;
      delete payload.__v;
      delete payload.createdAt;
      delete payload.updatedAt;
      delete payload.userId;

      const res = await updateCv({ id, ...payload }).unwrap();
      console.log("CV updated successfully!", res);
      // RTK Query will update cached cv if you configured tags; if not, you can refresh manually
    } catch (err) {
      console.error("Error updating CV", err);
      // you can show error UI here
    }
  };

  if (isLoading) return <div className="p-4 text-white">Loading CV...</div>;
  if (isError) return <div className="p-4 text-red-500">Error loading CV</div>;

  return (
    <div className="p-4 text-white">
      <div className="flex gap-4 p-4">
        {/* LEFT PANEL — ALL FIELDS */}
        <div className="w-1/4 space-y-4 text-white  p-3 border rounded bg-gray-900">
          <h2 className="text-lg font-bold mb-2">CV Fields</h2>

          {/* Title */}
          <div>
            <label className="block text-sm mb-1">Title</label>
            <input
              className="w-full p-2 border rounded"
              placeholder="Title"
              value={formData.title}
              onChange={(e) => handleFieldChange("title", e.target.value)}
            />
          </div>

          {/* Profile Photo */}
          <div>
            <label className="block text-sm font-medium mb-1">Profile Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e.target.files?.[0])}
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
                  onClick={handleDeletePhoto}
                >
                  X
                </button>
              </div>
            )}
          </div>

          {/* Personal Info */}
          <div>
            <h3 className="font-semibold text-sm mb-1">Personal Info</h3>
            {["name", "email", "phone", "address"].map((f) => (
              <input
                key={f}
                className="w-full p-2 border rounded mb-1 "
                placeholder={f}
                value={(formData.personal && formData.personal[f]) ?? ""}
                onChange={(e) => handlePersonalChange(f, e.target.value)}
              />
            ))}
          </div>

          {/* Comma lists */}
          <div>
            <h3 className="font-semibold text-sm mt-3 mb-1">Other Info</h3>
            {["skills", "languages", "awards", "certificates", "interests"].map((field) => (
              <input
                key={field}
                className="w-full p-2 border rounded mb-1"
                placeholder={`${field} (comma separated)`}
                value={Array.isArray(formData[field]) ? formData[field].join(", ") : ""}
                onChange={(e) => handleCommaInput(field, e.target.value)}
              />
            ))}
          </div>

          {/* Summary */}
          <div>
            <label className="block text-sm mb-1">Summary</label>
            <textarea
              className="w-full p-2 border rounded"
              placeholder="Summary"
              value={formData.summary}
              onChange={(e) => handleFieldChange("summary", e.target.value)}
            />
          </div>

          {/* Dynamic sections */}
          {[
            { name: "education", fields: ["degree", "institution", "startYear", "endYear"] },
            {
              name: "experience",
              fields: ["company", "position", "startDate", "endDate", "description"],
            },
            { name: "projects", fields: ["name", "description", "link"] },
            { name: "publications", fields: ["title", "publisher", "date"] },
            { name: "volunteering", fields: ["organization", "role", "startDate", "endDate"] },
          ].map((section) => (
            <div key={section.name} className="border p-2 rounded bg-gray-800">
              <h3 className="font-semibold mb-2 capitalize">{section.name}</h3>
              <button
                className="bg-gray-200 text-black px-2 py-1 text-sm rounded mb-2"
                onClick={() =>
                  addEntry(section.name, Object.fromEntries(section.fields.map((f) => [f, ""])))
                }
              >
                + Add {section.name.slice(0, -1)}
              </button>

              {(Array.isArray(formData[section.name]) ? formData[section.name] : []).map(
                (entry, idx) => (
                  <div key={idx} className="space-y-1 mb-2 relative border p-2 rounded">
                    <button
                      className="absolute top-1 right-1 bg-red-500 text-white rounded px-1 text-xs"
                      onClick={() => deleteEntry(section.name, idx)}
                    >
                      Delete
                    </button>

                    {/* fields inputs */}
                    {section.fields.map((f) => (
                      <input
                        key={f}
                        className="w-full p-1 border rounded"
                        placeholder={f}
                        value={
                          // If entry is string, parse it for this field
                          typeof entry === "string"
                            ? parseStringToObject(entry, section.fields)[f] ?? ""
                            : entry?.[f] ?? ""
                        }
                        onChange={(e) =>
                          handleDynamicChange(section.name, idx, f, e.target.value, section.fields)
                        }
                      />
                    ))}
                  </div>
                )
              )}
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

              <hr className="my-4" />

              {/* summary */}
              {formData.summary && (
                <section className="mb-4">
                  <h2 className="text-xl font-semibold mb-1" style={{ color: editorStyle.headingColor }}>
                    Summary
                  </h2>
                  <p>{formData.summary}</p>
                </section>
              )}

              {/* simple lists */}
              {[
                ["skills", "Skills"],
                ["languages", "Languages"],
                ["awards", "Awards"],
                ["certificates", "Certificates"],
                ["interests", "Interests"],
              ].map(([key, label]) =>
                formData[key]?.length > 0 ? (
                  <section key={key} className="mb-4">
                    <h2 className="text-xl font-semibold mb-1" style={{ color: editorStyle.headingColor }}>
                      {label}
                    </h2>
                    <ul className="list-disc list-inside">
                      {formData[key].map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </section>
                ) : null
              )}

              {/* detailed sections */}
              {[
                ["education", "Education", ["degree", "institution", "startYear", "endYear"]],
                ["experience", "Experience", ["company", "position", "startDate", "endDate", "description"]],
                ["projects", "Projects", ["name", "description", "link"]],
                ["publications", "Publications", ["title", "publisher", "date"]],
                ["volunteering", "Volunteering", ["organization", "role", "startDate", "endDate"]],
              ].map(([key, label, fields]) =>
                formData[key]?.length > 0 ? (
                  <section key={key} className="mb-4">
                    <h2 className="text-xl font-semibold mb-1" style={{ color: editorStyle.headingColor }}>
                      {label}
                    </h2>
                    <div className="space-y-2">
                      {formData[key].map((entry, i) => (
                        <div key={i} className="border-b pb-2">
                          {fields.map((f) =>
                            (entry && entry[f]) ? (
                              <p key={f} className="text-sm">
                                <span className="font-medium capitalize">{f}:</span> {entry[f]}
                              </p>
                            ) : null
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                ) : null
              )}
            </div>
          ) : (
            <p className="text-center text-gray-500 mt-20">Start filling fields on the left to preview your CV</p>
          )}
        </div>

        {/* RIGHT PANEL */}
        <div className="w-1/4 space-y-4 border rounded p-2 text-white">
          <h2 className="font-bold text-lg">Editor</h2>
          <label className="block">
            Font Size
            <input
              type="number"
              className="w-full p-2 border rounded"
              value={parseInt(editorStyle.fontSize)}
              onChange={(e) => setEditorStyle((p) => ({ ...p, fontSize: e.target.value + "px" }))}
            />
          </label>
          <label className="block">
            Font Family
            <select
              className="w-full p-2 border rounded"
              value={editorStyle.fontFamily}
              onChange={(e) => setEditorStyle((p) => ({ ...p, fontFamily: e.target.value }))}
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
              onChange={(e) => setEditorStyle((p) => ({ ...p, color: e.target.value }))}
            />
          </label>
          <label className="block">
            Heading Color
            <input
              type="color"
              className="w-full h-10"
              value={editorStyle.headingColor}
              onChange={(e) => setEditorStyle((p) => ({ ...p, headingColor: e.target.value }))}
            />
          </label>
          <label className="block">
            Background Color
            <input
              type="color"
              className="w-full h-10"
              value={editorStyle.backgroundColor}
              onChange={(e) => setEditorStyle((p) => ({ ...p, backgroundColor: e.target.value }))}
            />
          </label>

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
