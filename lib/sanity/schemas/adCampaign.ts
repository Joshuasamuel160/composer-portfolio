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
      name: "videoUrl",
      title: "Commercial Spot Video Embed URL (YouTube/Vimeo)",
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
