import { defineType, defineField } from "sanity";

export const contactInfo = defineType({
  name: "contactInfo",
  title: "Contact & Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "email",
      title: "Direct Email Address",
      type: "string",
      description: "Primary contact email address for inquiries",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "locations",
      title: "Locations / Cities (Shown in Footer)",
      type: "string",
      description: "e.g. LAGOS • NIGERIA",
      initialValue: "LAGOS • NIGERIA",
    }),
    defineField({
      name: "representation",
      title: "Representation / Management Details (Optional)",
      type: "text",
      rows: 3,
      description: "e.g. Agency, Agent Name, Contact Email & Phone",
    }),
    defineField({
      name: "socials",
      title: "Digital & Social Media Platforms",
      type: "array",
      of: [
        {
          type: "object",
          name: "socialLink",
          title: "Social Link",
          fields: [
            { name: "platform", title: "Platform Name (e.g. Instagram, Spotify, YouTube, IMDb)", type: "string" },
            { name: "url", title: "Profile URL", type: "url" },
            { name: "handle", title: "Display Handle (e.g. @joshuasamuelmusic)", type: "string" },
          ],
        },
      ],
    }),
    defineField({
      name: "featuredSongs",
      title: "Featured Songs & Movies for Home Page Hero Showreel",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "song" }, { type: "album" }, { type: "screenProject" }],
        },
      ],
      description: "Select which songs, albums, or movies to feature in the Home Page Hero player",
    }),
  ],
});
