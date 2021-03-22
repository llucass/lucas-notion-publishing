const path = require("path")

module.exports.onCreateNode = ({ node, actions }) => {
  // Transform the new node here and create a new node or
  // create a new node field.
  const { createNodeField } = actions
  if (node.internal.type === "MarkdownRemark") {
    const slug = path.basename(node.fileAbsolutePath, ".md")
    createNodeField({
      //same as node: node
      node,
      name: "slug",
      value: slug,
    })
  }
}

module.exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions
  //dynamically create pages here
  //get path to template
  const blogTemplate = path.resolve("./src/templates/blog.js")
  //get slugs
  const response = await graphql(`
    query {
      allMarkdownRemark {
        edges {
          node {
            fields {
              slug
            }
          }
        }
      }
    }
  `)
  //create new pages with unique slug
  response.data.allMarkdownRemark.edges.forEach(edge => {
    createPage({
      component: blogTemplate,
      path: `/blog/${edge.node.fields.slug}`,
      context: {
        slug: edge.node.fields.slug,
      },
    })
  })
}

// graphql function doesn't throw an error so we have to check to check for the result.errors to throw manually
const path = require(`path`)

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  const blogPost = await graphql(`
  query {
      allPosts(filter: {status: {eq: "published"}, content_type: {eq: "article"}}) {
          nodes {
            slug
            url
          }
        }
      }
    `).then(result => {
      if (result.errors) {
        Promise.reject(result.errors);
      }
      
      result.data.allPosts.nodes.forEach(({ slug, url }) => {
        createPage({
            path: `blog/posts/${url}`,
            component: path.resolve(`./src/templates/blogPost.js`),
            context: {
                // Data passed to context is available
                // in page queries as GraphQL variables.
                slug: slug,
            },
        });
    });
  });
  const newsPost = await graphql(`
  query {
      allPosts(filter: {status: {eq: "published"}, content_type: {eq: "newsletter"}}) {
          nodes {
            slug
            url
          }
        }
      }
    `).then(result => {
      if (result.errors) {
        Promise.reject(result.errors);
      }
      
      result.data.allPosts.nodes.forEach(({ slug, url }) => {
        createPage({
            path: `subscribe/posts/${url}`,
            component: path.resolve(`./src/templates/blogPost.js`),
            context: {
                // Data passed to context is available
                // in page queries as GraphQL variables.
                slug: slug,
            },
        });
    });
  });

  return Promise.all([blogPost, newsPost]);
};