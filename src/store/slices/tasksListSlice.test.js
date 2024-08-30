import { configureStore } from '@reduxjs/toolkit';
import taskReducer, { fetchTasks } from './taskSlice';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const mock = new MockAdapter(axios);

const store = configureStore({
  reducer: {
    tasks: taskReducer,
  },
});

describe('taskSlice', () => {
  afterEach(() => {
    mock.reset();
  });

  test('should fetch tasks', async () => {
    const tasks = [
      { id: '1', title: 'Test Task', description: 'Test Description', status: 'todo' },
    ];

    mock.onGet('/api/tasks').reply(200, { tasks });

    await store.dispatch(fetchTasks());
    const state = store.getState().tasks;

    expect(state.tasks).toEqual(tasks);
    expect(state.status).toBe('succeeded');
  });

  test('should handle fetch tasks errors', async () => {
    mock.onGet('/api/tasks').reply(500);

    await store.dispatch(fetchTasks());
    const state = store.getState().tasks;

    expect(state.status).toBe('failed');
    expect(state.error).toBe('Request failed with status code 500');
  });
});