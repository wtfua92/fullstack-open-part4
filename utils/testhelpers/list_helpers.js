// eslint-disable-next-line no-unused-vars
const blogsList = [
    {
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        likes: 7,
    },
    {
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
    },
    {
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
        likes: 12,
    },
    {
        title: 'First class tests',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
        likes: 10,
    },
    {
        title: 'TDD harms architecture',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
        likes: 0,
    },
    {
        title: 'Type wars',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
        likes: 2,
    }
];

const dummy = () => {
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
    blogsList,
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
};