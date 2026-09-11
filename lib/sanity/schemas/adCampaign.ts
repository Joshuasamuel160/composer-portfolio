import { defineType, defineField } from "sanity";

export const adCampaign = defineType({
  name: "adCampaign",
  title: "Ad Campaign",
  type: "document",
  fields: [
    defineField({
      name: "brandName",
      title: "Brand & Campaign Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "thumbnail",
      title: "Thumbnail Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "videoFile",
      title: "Upload Commercial Video File (MP4/MOV)",
      type: "file",
      options: { accept: "video/mp4,video/quicktime,video/*" },
      description: "Upload video file directly from your computer",
    }),
    defineField({
      name: "videoUrl",
      title: "Or Paste Commercial Spot Video URL (YouTube/Vimeo)",
      type: "url",
    }),
    defineField({
      name: "description",
      title: "One-line Work Description (e.g. Original score + sound design, 30s spot)",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
    }),
  ],
  orderings: [
    {
      title: "Manual Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
});
