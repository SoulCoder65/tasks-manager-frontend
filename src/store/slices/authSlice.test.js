import { configureStore } from '@reduxjs/toolkit';
import authReducer, { login, signup } from './authSlice';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const mock = new MockAdapter(axios);

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

describe('authSlice', () => {
  afterEach(() => {
    mock.reset();
  });

  test('should handle login', async () => {
    const email = 'test@example.com';
    const password = 'password123';
    const token = 'mockedToken';

    mock.onPost('/api/login').reply(200, { token });

    await store.dispatch(login(email, password));
    const state = store.getState().auth;

    expect(state.token).toBe(token);
  });

  test('should handle signup', async () => {
    const email = 'newuser@example.com';
    const password = 'newpassword123';
    const token = 'mockedSignupToken';

    mock.onPost('/api/signup').reply(200, { token });

    await store.dispatch(signup(email, password));
    const state = store.getState().auth;

    expect(state.token).toBe(token);
  });

  test('should handle login errors', async () => {
    const email = 'wrong@example.com';
    const password = 'wrongpassword';

    mock.onPost('/api/login').reply(400);

    await store.dispatch(login(email, password));
    const state = store.getState().auth;

    expect(state.error).toBe('Invalid credentials');
  });
});