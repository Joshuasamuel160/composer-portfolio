import { defineType, defineField } from "sanity";

export const album = defineType({
  name: "album",
  title: "Album / Soundtrack",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Album / Soundtrack Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "artist",
      title: "Artist / Production Studio",
      type: "reference",
      to: [{ type: "artist" }],
    }),
    defineField({
      name: "artistName",
      title: "Or Type Artist / Studio Name",
      type: "string",
      description: "e.g. Warner Bros., A24, Julian Vance",
    }),
    defineField({
      name: "coverImage",
      title: "Cover Artwork",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "releaseYear",
      title: "Release Year",
      type: "string",
    }),
    defineField({
      name: "category",
      title: "Album Category",
      type: "string",
      options: {
        list: [
          { title: "Film Soundtrack", value: "Soundtrack" },
          { title: "Studio Album", value: "Album" },
          { title: "EP", value: "EP" },
          { title: "Single", value: "Single" },
        ],
        layout: "radio",
      },
      initialValue: "Album",
    }),
    defineField({
      name: "tracks",
      title: "Tracklist",
      type: "array",
      of: [
        {
          type: "object",
          name: "albumTrack",
          title: "Track",
          fields: [
            { name: "title", title: "Track Title", type: "string" },
            { name: "role", title: "Your Role (e.g. Composer, Producer)", type: "string" },
            { name: "audioFile", title: "Upload MP3 Audio File", type: "file" },
            { name: "audioUrl", title: "Or Paste Audio Stream URL", type: "url" },
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
