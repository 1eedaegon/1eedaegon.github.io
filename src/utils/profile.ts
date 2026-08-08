import type { CollectionEntry } from 'astro:content';

export type ProfileSection = CollectionEntry<'profile-sections'>;

/**
 * Type-predicate filter for the `profile-sections` discriminated union.
 *
 * `Array.prototype.filter((i) => i.data.type === t)` does not narrow, which is
 * why about.astro/code.astro carried `as any` casts. This predicate narrows the
 * entry's `data` to the matching union branch, so the section components'
 * structural `Props` typecheck without casts:
 *
 *   const educationItems = allProfileSections.filter(ofType('education'));
 */
export const ofType =
  <T extends ProfileSection['data']['type']>(t: T) =>
  (
    item: ProfileSection,
  ): item is ProfileSection & {
    data: Extract<ProfileSection['data'], { type: T }>;
  } =>
    item.data.type === t;
