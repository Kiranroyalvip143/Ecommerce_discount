import Header from "./components/Header";
import ProductList from "./components/ProductList";
import "./App.css";

function App() {
  return (
    <>
      <Header />
      <div className="App">
        <ProductList />
      </div>
    </>
  );
}

export default App;
