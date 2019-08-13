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
        expect(result).toBe(15);
    });
});

describe('favoriteBlog', function () {
    test('should return favorite blog', () => {
        const result = favoriteBlog(blogsList);
        expect(result).toEqual({
            title: 'React patterns',
            author: 'Michael Chan',
            likes: 7
        });
    });
});

describe('mostBlogs', function () {
    test('should return author with the biggest number of blogs', () => {
        const result = mostBlogs(blogsList);
        expect(result).toEqual({
            author: 'Michael Chan',
            blogs: 2
        });
    });
});

describe('mostLikes', function () {
    test('should return author with the biggest number of likes', () => {
        const result = mostLikes(blogsList);
        expect(result).toEqual({
            author: 'Michael Chan',
            likes: 10
        });
    });
});