const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper.js')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Tester',
        username: 'testuser',
        password: 'password'
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    const usernameBox = page.getByRole('textbox', { name: 'username' })
    const passwordBox = page.getByRole('textbox', { name: 'password' })
    const loginButton = page.getByRole('button', { name: 'login' })

    await expect(usernameBox).toBeVisible()
    await expect(passwordBox).toBeVisible()
    await expect(loginButton).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'testuser', 'password')
      await expect(page.getByText('tester logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'testuser', 'wrong')

      const errorDiv = page.locator('.error')
      await expect(errorDiv).toContainText('wrong credentials')
      await expect(errorDiv).toHaveCSS('border-style', 'solid')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'testuser', 'password')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'This is a test', 'Edsger Dijkstra', 'www.example.com/blog')

      await expect(page.locator('.blog').getByText('This is a test by Edsger Dijkstra')).toBeVisible()
      await expect(page.locator('.success').getByText('a new blog This is a test by Edsger Dijkstra added')).toBeVisible()
    })

    test('blogs are arranged in order according to the likes', async ({ page, request }) => {
      await createBlog(page, 'Blog one', 'John Doe', 'www.example.com/blog-one') // mid (3)
      await expect(page.locator('.blogHeader').getByText('Blog one')).toBeVisible()
      await createBlog(page, 'Blog two', 'John Doe', 'www.example.com/blog-two') // highest (10)
      await expect(page.locator('.blogHeader').getByText('Blog two')).toBeVisible()
      await createBlog(page, 'Blog three', 'John Doe', 'www.example.com/blog-three') // lowest (1)
      await expect(page.locator('.blogHeader').getByText('Blog three')).toBeVisible()

      const response = await request.get('http://localhost:3003/api/blogs')
      const blogs = await response.json()

      for (const blog of blogs) {
        let likes = 0
        if (blog.title === 'Blog one') {
          likes = 3
        } else if (blog.title === 'Blog two') {
          likes = 1
        } else if (blog.title === 'Blog three') {
          likes = 10
        }
        await request.put(`http://localhost:3003/api/blogs/${blog.id}`, {
          data: { ...blog, likes }
        })
      }

      await page.reload()
      const blogElements = await page.locator('.blogHeader')
      
      await expect(blogElements.nth(0)).toContainText('Blog three')
      await expect(blogElements.nth(1)).toContainText('Blog one')
      await expect(blogElements.nth(2)).toContainText('Blog two')
    })

    describe('When a blog exists', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, 'This is a test', 'Edsger Dijkstra', 'www.example.com/blog')
      })

      test('blogs can be liked', async ({ page }) => {
        await page.getByRole('button', { name: 'view' }).click()
        await expect(page.locator('.blog').getByText('Likes: 0')).toBeVisible()
        await page.getByRole('button', { name: 'Like' }).click()
        await expect(page.locator('.blog').getByText('Likes: 1')).toBeVisible()
      })

      test('blogs can be deleted by the user who added the blog', async ({ page }) => {
        await expect(page.locator('.blog').getByText('This is a test')).toBeVisible()
        await page.getByRole('button', { name: 'view' }).click()

        await page.on('dialog', dialog => dialog.accept())
        await page.getByRole('button', { name: 'remove' }).click()

        await expect(page.locator('.blog').getByText('This is a test')).not.toBeVisible()
      })

      test('only the user who uploaded the blog sees the delete button', async ({ page, request }) => {
        await request.post('http://localhost:3003/api/users', {
          data: {
            name: 'Second Tester',
            username: 'secondtestuser',
            password: 'password'
          }
        })

        await page.getByRole('button', { name: 'logout' }).click()
        await loginWith(page, 'secondtestuser', 'password')

        await expect(page.locator('.blog').getByText('This is a test')).toBeVisible()
        await page.getByRole('button', { name: 'view' }).click()

        await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
      })
    })
  })
})