import request from 'supertest';
import app from '../app/app';
import { connectTestDB, disconnectTestDB } from './testSetup';
import { loginTestAdmin } from './helper';
import { IBlog } from '../app/models/blog.model';

jest.setTimeout(15000);

let adminToken: string;
let blog: IBlog;
let blogId: string;

blogId = ""


beforeAll(async () => {
  await connectTestDB();
  const { token } = await loginTestAdmin();
  adminToken = token;
});

afterAll(async () => {
  await disconnectTestDB();
});

describe('📝 Blog Routes - Hermex Blog', () => {
  it('should create a new blog', async () => {
    const res = await request(app)
      .post('/api/v1/blog/admin/create')
      .set('Authorization', `Bearer ${adminToken}`)
      .field('title', 'Test Blog Title')
      .field('content', 'This is the blog content for testing')


    // Update blog, blogId
    blog = res.body.blog;
    blogId = blog._id;


    expect(res.statusCode).toBe(201);
    expect(res.body.blog).toHaveProperty('_id');
    expect(blog.title).toBe('Test Blog Title');    
    
  });
  it('should retrieve the blog by ID', async () => {
    const res = await request(app)
      .get(`/api/v1/blog/${blogId}`)
      .set('Authorization', `Bearer ${adminToken}`);

      const blog_res = res.body
      
    expect(res.statusCode).toBe(200);
    expect(blog_res).toHaveProperty('_id', blogId);
  });

  it('should update the blog', async () => {
    const res = await request(app)
      .patch(`/api/v1/blog/admin/${blogId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Updated Blog Title',
        tags: ['life', 'tech'],
      });

      const ttl = res.body.blog
    expect(res.statusCode).toBe(200);
    expect(ttl.title).toBe('Updated Blog Title');
  });

  it('should retrieve all blogs (with pagination)', async () => {
    const res = await request(app)
      .get('/api/v1/blog?page=1&limit=10')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('blogs');
    expect(Array.isArray(res.body.blogs)).toBe(true);
  });

  it('should delete the blog', async () => {
    const res = await request(app)
      .delete(`/api/v1/blog/admin/${blogId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message.toLowerCase()).toMatch(/deleted/);
  });

  it('should return 404 when blog is deleted', async () => {
    const res = await request(app)
      .get(`/api/v1/blog/${blogId}`)
      .set('Authorization', `Bearer ${adminToken}`);      
    expect(res.statusCode).toBe(404);
  });
});
