import api from '../store/api';

export default ({ $axios }) => {
  api.setInstance($axios);
};
