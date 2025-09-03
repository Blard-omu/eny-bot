import request from 'supertest';
import app from '../app/app';
import { connectTestDB, disconnectTestDB } from './testSetup';
import { loginTestAdmin, createTestBlog } from './helper';

jest.setTimeout(15000);

let adminToken: string;
let commentId: string;
let blogId: string;

beforeAll(async () => {
  await connectTestDB();
  const { token} = await loginTestAdmin();
  const ID  = await createTestBlog(token);
  adminToken = token;
  blogId = ID
});

afterAll(async () => {
  await disconnectTestDB();
});

describe('💬 Comment Routes - Hermex Blog', () => {
  it('should create a new comment', async () => {
    const res = await request(app)
      .post(`/api/v1/comment/add/${blogId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        content: 'This is a test comment',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.comment).toHaveProperty('_id');
    expect(res.body.comment.content).toBe('This is a test comment');


    commentId = res.body.comment._id;
    // console.log(commentId);
  });

  it('should retrieve all comments (paginated)', async () => {
    const res = await request(app)
      .get(`/api/v1/comment/list/${blogId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.comments)).toBe(true);
  });

  it('should get comment by ID', async () => {
    const res = await request(app)
      .get(`/api/v1/comment/${commentId}`)
      .set('Authorization', `Bearer ${adminToken}`);      

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('_id', commentId);
  });

  it('should update the comment', async () => {
    const res = await request(app)
      .patch(`/api/v1/comment/update/${commentId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ content: 'Updated comment content' });

    expect(res.statusCode).toBe(200);
    expect(res.body.comment.content).toBe('Updated comment content');
  });

  it('should delete the comment', async () => {
    const res = await request(app)
      .delete(`/api/v1/comment/delete/${commentId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message.toLowerCase()).toMatch(/deleted/);
  });

  it('should return 404 for deleted comment', async () => {
    const res = await request(app)
      .get(`/api/v1/comment/${commentId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(404);
  });
});
