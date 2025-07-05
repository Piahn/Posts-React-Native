const { validationResult } = require("express-validator");
const prisma = require("../client/index");
const fs = require("fs");
const path = require("path");

// Controllers findPosts
const findPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      select: {
        id: true,
        image: true,
        title: true,
        content: true,
      },
      orderBy: {
        id: "desc",
      },
    });

    res.status(200).send({
      success: true,
      message: "Get all posts successfully",
      data: posts,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

// Controllers createPost
const createPost = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: "Validation error",
      errors: errors.array(),
    });
  }

  try {
    const post = await prisma.post.create({
      data: {
        image: req.file.filename,
        title: req.body.title,
        content: req.body.content,
      },
    });

    res.status(201).send({
      success: true,
      message: "Post created successfully",
      data: post,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

// Controllers findPostById
const findPostById = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await prisma.post.findUnique({
      where: {
        id: Number(id),
      },
      select: {
        id: true,
        image: true,
        title: true,
        content: true,
      },
    });

    res.status(200).send({
      success: true,
      message: `Get Post By ID: ${id}`,
      data: post,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

// Controllers updatePost
const updatePost = async (req, res) => {
  const { id } = req.params;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: "Validation error",
      errors: errors.array(),
    });
  }

  try {
    //init data
    const dataPost = {
      title: req.body.title,
      content: req.body.content,
      updatedAt: new Date(),
    };

    if (req.file) {
      dataPost.image = req.file.filename;

      // Tujuan Mengambil data berdasarkan id
      const post = await prisma.post.findUnique({
        where: {
          id: Number(id),
        },
      });

      if (post && post.image) {
        // Bangun path lengkap ke file lama
        const oldImagePath = path.join(
          process.cwd(),
          "src/uploads",
          post.image
        );

        // Hapus gambar lama jika file ada
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        } else {
          console.log("File tidak ditemukan:", oldImagePath);
        }
      }
    }

    const post = await prisma.post.update({
      where: {
        id: Number(id),
      },
      data: dataPost,
    });

    res.status(200).send({
      success: true,
      message: `Post updated successfully`,
      data: post,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

const deletePost = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await prisma.post.delete({
      where: {
        id: Number(id),
      },
    });

    if (post && post.image) {
      // Bangun path lengkap ke file lama
      const oldImagePath = path.join(process.cwd(), "src/uploads", post.image);

      // Hapus gambar lama jika file ada
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      } else {
        console.log("File tidak ditemukan:", oldImagePath);
      }
    }

    res.status(200).send({
      success: true,
      message: `Post deleted successfully`,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  findPosts,
  createPost,
  findPostById,
  updatePost,
  deletePost,
};
