package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.Brand;
import hibernate.Color;
import hibernate.HibernateUtil;
import hibernate.Model;
import hibernate.Product;
import hibernate.Quality;
import hibernate.Status;
import hibernate.User;
import java.io.File;
import java.io.IOException;
import java.nio.file.CopyOption;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.util.Date;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import model.Util;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Restrictions;

@MultipartConfig
@WebServlet(name = "SaveProduct", urlPatterns = {"/SaveProduct"})
public class SaveProduct extends HttpServlet {

    private static final int ACRIVE_STAUTUS_ID = 2;

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        String brandId = request.getParameter("brandId");
        String modelId = request.getParameter("modelId");
        String title = request.getParameter("title");
        String description = request.getParameter("description");
        String colorId = request.getParameter("colorId");
        String conditionId = request.getParameter("conditionId");
        String price = request.getParameter("price");
        String qty = request.getParameter("qty");

        Part part1 = request.getPart("image1");
        Part part2 = request.getPart("image2");
        Part part3 = request.getPart("image3");
        Part part4 = request.getPart("image4");

        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("status", false);

        SessionFactory sf = HibernateUtil.getSessionFactory();
        Session s = sf.openSession();

        //validation
        if (request.getSession().getAttribute("user") == null) {
            responseObject.addProperty("message", "Please sign in!");
        } else if (!Util.isInteger(brandId)) {
            responseObject.addProperty("message", "Invalid brand!");
        } else if (Integer.parseInt(brandId) == 0) {
            responseObject.addProperty("message", "Please select a brand!");
        } else if (!Util.isInteger(modelId)) {
            responseObject.addProperty("message", "Invalid model!");
        } else if (Integer.parseInt(modelId) == 0) {
            responseObject.addProperty("message", "Please select a model!");
        } else if (title.isEmpty()) {
            responseObject.addProperty("message", "Product title can not be empty");
        } else if (description.isEmpty()) {
            responseObject.addProperty("message", "Product description can not be empty");
        } else if (!Util.isInteger(colorId)) {
            responseObject.addProperty("message", "Invalid color");
        } else if (Integer.parseInt(colorId) == 0) {
            responseObject.addProperty("message", "Please select a valid color");
        } else if (!Util.isInteger(conditionId)) {
            responseObject.addProperty("message", "Invalid condition");
        } else if (Integer.parseInt(conditionId) == 0) {
            responseObject.addProperty("message", "Please select a valid condition");
        } else if (!Util.isDouble(price)) {
            responseObject.addProperty("message", "Invalid price");
        } else if (Double.parseDouble(price) <= 0) {
            responseObject.addProperty("message", "Price must be greater than 0");
        } else if (!Util.isInteger(qty)) {
            responseObject.addProperty("message", "Invalid quantity");
        } else if (Integer.parseInt(qty) <= 0) {
            responseObject.addProperty("message", "Quantity must be greater than 0");
        } else if (part1.getSubmittedFileName() == null) {
            responseObject.addProperty("message", "Product image one is required");
        } else if (part2.getSubmittedFileName() == null) {
            responseObject.addProperty("message", "Product image two is required");
        } else if (part3.getSubmittedFileName() == null) {
            responseObject.addProperty("message", "Product image three is required");
        } else if (part4.getSubmittedFileName() == null) {
            responseObject.addProperty("message", "Product image four is required");
        } else {

            Brand brand = (Brand) s.get(Brand.class, Integer.valueOf(brandId));
            if (brand == null) {
                responseObject.addProperty("message", "Please select a valid Brand Name!");
            } else {

                Model model = (Model) s.get(Model.class, Integer.parseInt(modelId));
                if (model == null) {
                    responseObject.addProperty("message", "Please select a valid Model Name!");
                } else {
                    if (model.getBrand().getId() != brand.getId()) {
                        responseObject.addProperty("message", "Please select a suitable Model!");
                    } else {
                        Color color = (Color) s.get(Color.class, Integer.valueOf(colorId));
                        if (color == null) {
                            responseObject.addProperty("message", "Please select a valid Color!");
                        } else {
                            Quality quality = (Quality) s.get(Quality.class, Integer.valueOf(conditionId));
                            if (quality == null) {
                                responseObject.addProperty("message", "Please select a valid Quality!");
                            } else {

                                Product p = new Product();
                                p.setModel(model);
                                p.setTitle(title);
                                p.setDescription(description);
                                p.setColor(color);
                                p.setQuality(quality);
                                p.setPrice(Double.parseDouble(price));
                                p.setQty(Integer.parseInt(qty));

                                Status status = (Status) s.get(Status.class, SaveProduct.ACRIVE_STAUTUS_ID);
                                p.setStatus(status);
                                User user = (User) request.getSession().getAttribute("user");

                                Criteria c1 = s.createCriteria(User.class);
                                c1.add(Restrictions.eq("email", user.getEmail()));
                                User u1 = (User) c1.uniqueResult();
                                p.setUser(u1);
                                p.setCreated_at(new Date());

                                int id = (int) s.save(p);
                                s.beginTransaction().commit();
                                s.close();

                                //image uploading
                                String appPath = getServletContext().getRealPath(""); //Full path of the Web Pages folder

                                String newPath = appPath.replace("build" + File.separator + "web", "web" + File.separator + "product-images");

                                File productFolder = new File(newPath, String.valueOf(id));
                                productFolder.mkdir();

                                File file1 = new File(productFolder, "image1.png");
                                Files.copy(part1.getInputStream(), file1.toPath(), StandardCopyOption.REPLACE_EXISTING);

                                File file2 = new File(productFolder, "image2.png");
                                Files.copy(part2.getInputStream(), file2.toPath(), StandardCopyOption.REPLACE_EXISTING);

                                File file3 = new File(productFolder, "image3.png");
                                Files.copy(part3.getInputStream(), file3.toPath(), StandardCopyOption.REPLACE_EXISTING);
                                
                                File file4 = new File(productFolder, "image4.png");
                                Files.copy(part4.getInputStream(), file4.toPath(), StandardCopyOption.REPLACE_EXISTING);
                                //image uploading

                                responseObject.addProperty("status", true);
                            }
                        }
                    }
                }

            }
        }

        //send response
        Gson gson = new Gson();
        response.setContentType("application/json");
        response.getWriter().write(gson.toJson(responseObject));
        //send response

    }
}
