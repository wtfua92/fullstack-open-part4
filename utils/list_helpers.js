// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => {
    return 1;
};

const totalLikes = (blogs) => {
    return blogs.map(b => b.likes).reduce((acc, val) => (acc + val), 0);
};

const favoriteBlog = (blogs) => {
    const {title, author, likes} = blogs.sort((a, b) => b.likes - a.likes)[0];
    return {
        title,
        author,
        likes
    };
};

const groupByAuthor = (blogs) => {
    return blogs.reduce(function (acc, obj) {
        let key = obj['author'];
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(obj);
        return acc;
    }, {});
};

const mostBlogs = (blogs) => {
    const groupedByAuthor = groupByAuthor(blogs);

    const [author, entries] = Object.entries(groupedByAuthor).sort((a, b) => b[1].length - a[1].length)[0];

    return {
        author,
        blogs: entries.length
    };
};

const mostLikes = (blogs) => {
    const groupedByAuthorAndSortedByNumberOfEntries = Object.entries(groupByAuthor(blogs)).sort((a, b) => a[1].length - b[1].length);

    return groupedByAuthorAndSortedByNumberOfEntries.reduce((a, [thisAuthor, thisEntries]) => {
        const totalLikes = thisEntries.reduce((acc, val) => (acc + val.likes), 0);
        if (a.likes < totalLikes) {
            a.author = thisAuthor;
            a.likes = totalLikes;
        }
        return a;
    }, {
        author: '',
        likes: 0
    });
};

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
};