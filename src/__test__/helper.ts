import request from 'supertest';
import app from '../app/app';



export const loginTestAdmin = async () => {
  const res = await request(app)
    .post('/api/v1/auth/register')
    .send({
      firstname: 'Test',
      lastname: 'Admin',
      username: 'Test Admin',
      email: `admin_${Date.now()}@example.com`,
      password: 'password123',
      role: 'admin',
    });

    // console.log(res.body);
    
  return {
    token: res.body.token,
  };
};


export const createTestBlog = async (token: string): Promise<string> => {
    const res = await request(app)
      .post('/api/v1/blog/admin/create')
      .set('Authorization', `Bearer ${token}`)
      .field('title', 'Test Blog Title')
      .field('content', 'This is a test blog content');
  
    return res.body.blog._id;
  };