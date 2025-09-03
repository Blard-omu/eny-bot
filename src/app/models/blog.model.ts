// import mongoose, { Schema, Document } from 'mongoose';

// export interface IBlog extends Document {
//   _id: string;
//   title: string;
//   content: string;
//   images: { url: string; publicId: string }[];
//   tags: string[];
//   categories: string[];
//   comments: any
//   author: string; // UUID
//   createdAt: Date;
//   updatedAt: Date;
// }

// export const BlogTags = ['tech', 'life', 'education', 'finance', 'travel'] as const;
// export const BlogCategories = ['tutorial', 'opinion', 'news', 'how-to'] as const;

// const blogSchema = new Schema<IBlog>(
//   {
//     title: {
//       type: String,
//       required: [true, 'Blog title is required'],
//       trim: true,
//     },
//     content: {
//       type: String,
//       required: [true, 'Blog content is required'],
//     },
//     images: [
//       {
//         url: { type: String, trim: true },
//         publicId: { type: String, trim: true },
//       },
//     ],
//     tags: {
//       type: [String],
//       enum: BlogTags,
//       default: ['tech'],
//     },
//     categories: {
//       type: [String],
//       enum: BlogCategories,
//       default: ['tutorial'],
//     },
//     author: {
//       type: String, // store Flask UUID
//       required: true,
//       index: true,
//     },
//   },
//   { timestamps: true }
// );


// // Virtual relationship with comments
// blogSchema.virtual('comments', {
//   ref: 'Comment',
//   localField: '_id',      // blog's ObjectId
//   foreignField: 'blog',   // field in Comment model
// });

// // Ensure virtuals are included when converting to JSON
// blogSchema.set('toObject', { virtuals: true });
// blogSchema.set('toJSON', { virtuals: true });

// export default mongoose.model<IBlog>('Blog', blogSchema);

// blog.model.ts
import mongoose, { Schema, Document } from 'mongoose';
import slugify from 'slugify';

export interface IBlog extends Document {
  _id: string;
  title: string;
  slug: string;
  content: string;
  images: { url: string; publicId: string }[];
  tags: string[];
  categories: string[];
  comments: any;
  author: string; // UUID
  createdAt: Date;
  updatedAt: Date;
}

export const BlogTags = ['tech', 'life', 'education', 'finance', 'travel'] as const;
export const BlogCategories = ['tutorial', 'opinion', 'news', 'how-to'] as const;

const blogSchema = new Schema<IBlog>(
  {
    title: {
      type: String,
      required: [true, 'Blog title is required'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    content: {
      type: String,
      required: [true, 'Blog content is required'],
    },
    images: [
      {
        url: { type: String, trim: true },
        publicId: { type: String, trim: true },
      },
    ],
    tags: {
      type: [String],
      enum: BlogTags,
      default: ['tech'],
    },
    categories: {
      type: [String],
      enum: BlogCategories,
      default: ['tutorial'],
    },
    author: {
      type: String, // store Flask UUID
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

// Generate slug before saving
blogSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

// Virtual relationship with comments
blogSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'blog',
});

blogSchema.set('toObject', { virtuals: true });
blogSchema.set('toJSON', { virtuals: true });

export default mongoose.model<IBlog>('Blog', blogSchema);
