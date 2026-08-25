import { defineType, defineField } from "sanity";

export const screenProject = defineType({
  name: "screenProject",
  title: "Screen Project",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Project Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "year",
      title: "Release Year",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "role",
      title: "Your Role (e.g. Original Score, Series Composer)",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "director",
      title: "Director Name",
      type: "string",
      description: "e.g. Denis Villeneuve",
    }),
    defineField({
      name: "executiveProducer",
      title: "Executive Producer (EP)",
      type: "string",
      description: "e.g. Mary Parent",
    }),
    defineField({
      name: "productionCompany",
      title: "Production Company / Studio",
      type: "string",
      description: "e.g. Warner Bros. / Legendary Pictures",
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Cinema Release", value: "Cinema" },
          { title: "YouTube / Online Film", value: "YouTube" },
        ],
        layout: "radio",
      },
      initialValue: "Cinema",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "poster",
      title: "Poster / Still Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "videoFile",
      title: "Upload Trailer Video File (MP4 / WebM)",
      type: "file",
      options: { accept: "video/*" },
      description: "Upload video file directly from your computer",
    }),
    defineField({
      name: "videoUrl",
      title: "Or Paste YouTube / Vimeo Trailer Link",
      type: "url",
      description: "Paste standard YouTube link (e.g. https://www.youtube.com/watch?v=...) or Vimeo link",
    }),
    defineField({
      name: "description",
      title: "Short Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "scoreCues",
      title: "Film Score Cues & Soundtrack Tracks",
      description: "Upload MP3 audio files or paste audio links pertaining to this movie",
      type: "array",
      of: [
        {
          type: "object",
          name: "scoreCue",
          title: "Score Cue Track",
          fields: [
            { name: "title", title: "Cue Title (e.g. Cue 01: Main Theme)", type: "string" },
            { name: "duration", title: "Duration (e.g. 2:45)", type: "string" },
            { name: "audioFile", title: "Upload MP3 Audio File", type: "file" },
            { name: "audioUrl", title: "Or Paste MP3 Audio URL", type: "url" },
          ],
        },
      ],
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
