import type { Movie } from "../src/interfaces/movie";
import { MovieEditor } from "../src/components/MovieEditor";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("MovieEditor Component", () => {
    const mockMovie: Movie = {
        id: "test-movie-123",
        title: "The Test Movie",
        rating: 8,
        description: "A movie for testing",
        released: 2020,
        soundtrack: [{ id: "song1", name: "Test Song", by: "Test Artist" }],
        watched: {
            seen: true,
            liked: true,
            when: "2023-01-01",
        },
    };

    const mockChangeEditing = jest.fn();
    const mockEditMovie = jest.fn();
    const mockDeleteMovie = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("renders MovieEditor with initial movie data", () => {
        render(
            <MovieEditor
                changeEditing={mockChangeEditing}
                movie={mockMovie}
                editMovie={mockEditMovie}
                deleteMovie={mockDeleteMovie}
            ></MovieEditor>,
        );
        const title = screen.getByDisplayValue("The Test Movie");

        expect(title).toBeInTheDocument();
    });

    test("initializes rating/description/soundtrack and saves", () => {
        const sampleMovie: Movie = {
            ...mockMovie,
            rating: 7,
            description: "Original description",
            soundtrack: [
                { id: "song1", name: "Test Song", by: "Test Artist" },
                { id: "song2", name: "Second Song", by: "Second Artist" },
            ],
        };

        render(
            <MovieEditor
                changeEditing={mockChangeEditing}
                movie={sampleMovie}
                editMovie={mockEditMovie}
                deleteMovie={mockDeleteMovie}
            />
        );

        expect(screen.getByDisplayValue("Original description")).toBeInTheDocument();
        expect(screen.getByDisplayValue("Test Song")).toBeInTheDocument();
        expect(screen.getByDisplayValue("Second Artist")).toBeInTheDocument();

        const titleInput = screen.getByLabelText(/title/i);
        userEvent.clear(titleInput);
        userEvent.type(titleInput, "Updated Title");
        userEvent.click(screen.getByRole("button", { name: /save/i }));

        expect(mockEditMovie).toHaveBeenCalledTimes(1);
        expect(mockEditMovie).toHaveBeenCalledWith(
            sampleMovie.id,
            expect.objectContaining({
                title: "Updated Title",
                rating: 8,
                description: "Original description",
                soundtrack: sampleMovie.soundtrack,
            }),
        );
        expect(mockChangeEditing).toHaveBeenCalledTimes(1);
    });
});

