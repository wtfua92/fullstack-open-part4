const {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes,
    blogsList
} = require('../utils/testhelpers/list_helpers');

test('dummy returns one', () => {
    const result = dummy([]);
    expect(result).toBe(1);
});

describe('totalLikes', () => {
    test('when list has only one blog equals the likes of that', () => {
        const result = totalLikes(blogsList);
        expect(result).toBe(36);
    });
});

describe('favoriteBlog', function () {
    test('should return favorite blog', () => {
        const result = favoriteBlog(blogsList);
        expect(result).toEqual({
            title: 'Canonical string reduction',
            author: 'Edsger W. Dijkstra',
            likes: 12,
        });
    });
});

describe('mostBlogs', function () {
    test('should return author with the biggest number of blogs', () => {
        const result = mostBlogs(blogsList);
        expect(result).toEqual({
            author: 'Robert C. Martin',
            blogs: 3
        });
    });
});

describe('mostLikes', function () {
    test('should return author with the biggest number of likes', () => {
        const result = mostLikes(blogsList);
        expect(result).toEqual({
            author: 'Edsger W. Dijkstra',
            likes: 17
        });
    });
});