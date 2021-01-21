const adminRouter = require('express').Router();
const adminController = require('../controllers/admin.controller');

const routes = () => {
  const {
    getIndex,
    getChangePwd,
    postChangePwd,
    createPosition,
    registerCandidate,
    getMapCandidates,
    postMapCandidate,
    fetchCandidates,
    getGenPasswordPage,
    generatePasswords,
    logout,
    middleware,
    } = adminController;

  adminRouter.use(middleware);

  adminRouter.route('/')
    .get(getIndex);

  adminRouter.route('/change-pwd')
    .get(getChangePwd)
    .post(postChangePwd);

  adminRouter.route('/get-candidates')
    .get(fetchCandidates);

  adminRouter.route('/create-position')
    .get((req, res) => {
      res.render('admin/create-position');
    })
    .post(createPosition);

  adminRouter.route('/register-candidate')
    .get((req, res) => {
      return res.render('admin/register-candidate');
    })
    .post(registerCandidate);

  adminRouter.route('/map-candidates')
    .get(getMapCandidates)
    .post(postMapCandidate);

  // adminRouter.route('/upload-image')
  //   .post(uploadImage);

  adminRouter.route('/generate-passwords')
    .get(getGenPasswordPage);
  
  adminRouter.route('/generate-passwords/generate')
    .get(generatePasswords);

  adminRouter.route('/logout')
    .get(logout);
  return adminRouter;
};

module.exports = routes;