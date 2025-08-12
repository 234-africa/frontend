import { mount } from '@vue/test-utils';
import Login from '../../src/components/auth/Login.vue';

describe('Login', () => {
  it('submits user credentials when the form is submitted', async () => {
    const mockLoginUser = jest.fn();
    const wrapper = mount(Login, {
      methods: {
        LOGIN_USER: mockLoginUser,
      },
    });

    // Set user credentials
    wrapper.find('input[type="email"]').setValue('test@example.com');
    wrapper.find('input[type="password"]').setValue('password123');

    // Submit the form
    wrapper.find('form').trigger('submit');
    await wrapper.vm.$nextTick();

    expect(mockLoginUser).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
  });

  it('displays an error message when login fails', async () => {
    const mockLoginUser = jest.fn().mockRejectedValue(new Error('Invalid credentials'));
    const wrapper = mount(Login, {
      methods: {
        LOGIN_USER: mockLoginUser,
      },
    });

    // Set invalid user credentials
    wrapper.find('input[type="email"]').setValue('test@example.com');
    wrapper.find('input[type="password"]').setValue('password123');

    // Submit the form
    wrapper.find('form').trigger('submit');
    await wrapper.vm.$nextTick();

    expect(wrapper.find('.error-message').text()).toBe('Invalid credentials');
  });

  it('redirects to the dashboard if the login is successful for an admin user', async () => {
    const mockLoginUser = jest.fn().mockResolvedValue({
      token: '...',
    });
    const mockRouterPush = jest.fn();
    const wrapper = mount(Login, {
      methods: {
        LOGIN_USER: mockLoginUser,
      },
      mocks: {
        $router: {
          push: mockRouterPush,
        },
      },
    });

    // Set user credentials
    wrapper.find('input[type="email"]').setValue('test@example.com');
    wrapper.find('input[type="password"]').setValue('password123');

    // Submit the form
    wrapper.find('form').trigger('submit');
    await wrapper.vm.$nextTick();

    expect(mockRouterPush).toHaveBeenCalledWith('/dash');
  });
});
