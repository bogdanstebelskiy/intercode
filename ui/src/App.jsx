import "./App.css";
import withAuth from "./features/auth/hocs/withAuth.jsx";
import RecipesListPage from "./features/recipies/pages/RecipesListPage.jsx";
import TokenService from "./features/auth/services/token.service.js";

function App() {
  return (
    <>
      <RecipesListPage />
    </>
  );
}

export default App;
