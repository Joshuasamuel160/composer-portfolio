import { defineType, defineField } from "sanity";

export const song = defineType({
  name: "song",
  title: "Song / Track",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Track Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "artist",
      title: "Artist",
      type: "reference",
      to: [{ type: "artist" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "role",
      title: "Your Role (e.g. Producer, Arranger, Mixer)",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "coverImage",
      title: "Cover Artwork",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "audioUrl",
      title: "Audio Stream URL (Direct mp3/wav audio link)",
      type: "url",
    }),
    defineField({
      name: "embedUrl",
      title: "Spotify / Apple Music / SoundCloud Embed URL",
      type: "url",
    }),
    defineField({
      name: "releaseYear",
      title: "Release Year",
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
