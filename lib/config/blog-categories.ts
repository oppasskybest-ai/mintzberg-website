import type { BlogCategory } from '@/types/content'

// Extracted from the 20 html/blog/{id}.html category-listing pages'
// <h1>Blog: {Category Name}</h1>. These pages are Drupal listing views,
// not content themselves — no post text comes from them, only this
// id -> label mapping, used for category filtering (Content Structure
// section 3: "Needs pagination, category filtering, search...").
export const BLOG_CATEGORIES: BlogCategory[] = [
  { id: '3', label: 'Simply Managing' },
  { id: '4', label: 'Rebalancing Society' },
  { id: '6', label: 'Simply Organizing' },
  { id: '9', label: 'Simply Thinking' },
  { id: '10', label: 'Learning Strategy' },
  { id: '11', label: 'Developing Managers' },
  { id: '12', label: 'Typos' },
  { id: '13', label: 'What I really think' },
  { id: '14', label: 'Simply Nonsense' },
  { id: '15', label: 'The Global Game' },
  { id: '16', label: 'Managing the Care of Health' },
  { id: '17', label: 'Reporting Live' },
  { id: '18', label: 'Some favorite quotes' },
  { id: '21', label: 'Getting it together' },
  { id: '22', label: 'Managing in the Digital Age' },
  { id: '24', label: 'Short Stories (Reflections from the Window)' },
  { id: '26', label: 'An ignorant take on...' },
]
