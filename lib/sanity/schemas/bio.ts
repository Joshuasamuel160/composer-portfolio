import { defineType, defineField } from "sanity";

export const bio = defineType({
  name: "bio",
  title: "Bio / About",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Full Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tagline",
      title: "One-line Role Tagline",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "photo",
      title: "Bio Photo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "paragraphs",
      title: "Bio Narrative Paragraphs",
      type: "array",
      of: [{ type: "text" }],
    }),
  ],
});

export const featuredWork = defineType({
  name: "featuredWork",
  title: "Featured Work",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: ["Screen", "Song", "Ad"],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "role",
      title: "Role / Description",
      type: "string",
    }),
    defineField({
      name: "image",
      title: "Preview Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "link",
      title: "Target Section Link (e.g. /screen, /songs, /ads)",
      type: "string",
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
