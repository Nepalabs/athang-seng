import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getAllBooks } from "../api/api";
import "./Library.css"; // Make sure to import the CSS file

const Home = () => {
  const [books, setBooks] = useState([]);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [currentBook, setCurrentBook] = useState(null);
  const { user, logout } = useAuth();

  useEffect(() => {
    const fetchBooks = async () => {
      const response = await getAllBooks();
      setBooks(response.data?.books || []);
    };
    fetchBooks();
  }, []);

  const handleLogout = () => {
    logout();
  };

  const handleAddBook = () => {
    setCurrentBook(null);
    setDialogOpen(true);
  };

  const handleEditBook = (book) => {
    setCurrentBook(book);
    setDialogOpen(true);
  };

  const handleDeleteBook = async (id) => {
    setBooks(books.filter((book) => book._id !== id));
  };

  const handleSaveBook = (bookData) => {
    if (currentBook) {
      setBooks(
        books.map((book) =>
          book._id === currentBook._id ? { ...book, ...bookData } : book
        )
      );
    } else {
      setBooks([...books, { ...bookData, _id: Date.now().toString() }]);
    }
    setDialogOpen(false);
  };

  return (
    <div className="container">
      <nav>
        <div>MyLibrary</div>
        <div>
          <span>{user?.name || "User"}</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div>
        <div className="library-header">
          <h1>Book Collection</h1>
          <button onClick={handleAddBook}>Add Book</button>
        </div>

        <div className="book-list">
          {books.length > 0 ? (
            books.map((book) => (
              <div key={book._id} className="book-card">
                <div className="book-info">
                  <h3 className="book-title">{book.title}</h3>
                  <p className="book-author">by {book.author}</p>
                  <div className="book-meta">
                    <span className="book-genre">{book.genre}</span>
                    <span className="book-year">{book.year}</span>
                  </div>
                  {book.completed && <span className="read-status">Read</span>}
                </div>
                <div className="book-actions">
                  <button onClick={() => handleEditBook(book)}>Edit</button>
                  <button onClick={() => handleDeleteBook(book._id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-library">
              Your library is empty. Add some books!
            </div>
          )}
        </div>

        {isDialogOpen && (
          <div className="dialog-overlay">
            <div className="dialog">
              <BookForm
                book={currentBook}
                onSave={handleSaveBook}
                onClose={() => setDialogOpen(false)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const BookForm = ({ book, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    title: book?.title || "",
    author: book?.author || "",
    genre: book?.genre || "Fiction",
    year: book?.year || "",
    completed: book?.completed || false,
  });

  const genres = [
    "Fiction",
    "Non-Fiction",
    "Science Fiction",
    "Fantasy",
    "Mystery",
    "Romance",
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form className="book-form" onSubmit={handleSubmit}>
      <h2>{book ? "Edit Book" : "Add New Book"}</h2>

      <div className="form-group">
        <label>Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Author</label>
        <input
          type="text"
          name="author"
          value={formData.author}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Genre</label>
        <select
          name="genre"
          value={formData.genre}
          onChange={handleChange}
          required
        >
          {genres.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Year</label>
        <input
          type="number"
          name="year"
          value={formData.year}
          onChange={handleChange}
          min="0"
          max={new Date().getFullYear()}
        />
      </div>

      <div className="form-group checkbox">
        <label>
          <input
            type="checkbox"
            name="completed"
            checked={formData.completed}
            onChange={handleChange}
          />
          I've read this book
        </label>
      </div>

      <div className="form-actions">
        <button type="button" onClick={onClose}>
          Cancel
        </button>
        <button type="submit">Save</button>
      </div>
    </form>
  );
};

export default Home;
