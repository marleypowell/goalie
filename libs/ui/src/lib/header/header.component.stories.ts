import { HeaderComponent } from './header.component';

export default {
  component: HeaderComponent,
};

export const Default = {
  args: {
    title: 'Goalie',
  },
};

export const WithLoginButton = {
  ...Default,
  args: {
    ...Default.args,
    showLoginButton: true,
  },
};

export const WithLogoutButton = {
  ...Default,
  args: {
    ...Default.args,
    showLogoutButton: true,
  },
};
