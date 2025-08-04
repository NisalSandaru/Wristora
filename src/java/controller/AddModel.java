package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.Brand;
import hibernate.HibernateUtil;
import hibernate.Model;
import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import model.Util;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Restrictions;

/**
 *
 * @author User
 */
@WebServlet(name = "AddModel", urlPatterns = {"/AddModel"})
public class AddModel extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        Gson gson = new Gson();
        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("status", false);

        JsonObject data = gson.fromJson(request.getReader(), JsonObject.class);

        String brandId = data.get("brandId").getAsString();
        String model = data.get("model").getAsString();

        SessionFactory sf = HibernateUtil.getSessionFactory();
        Session s = sf.openSession();

        //validation
        if (request.getSession().getAttribute("admin") == null) {
            responseObject.addProperty("message", "Please sign in!");
        } else if (!Util.isInteger(brandId)) {
            responseObject.addProperty("message", "Invalid brand!");
        } else if (Integer.parseInt(brandId) == 0) {
            responseObject.addProperty("message", "Please select a brand!");
        } else if (model.isEmpty()) {
            responseObject.addProperty("message", "Please Enter Model name!");
        } else {

            Brand brand = (Brand) s.get(Brand.class, Integer.valueOf(brandId));
            if (brand == null) {
                responseObject.addProperty("message", "Please select a valid Brand Name!");
            } else {

                Criteria criteria = s.createCriteria(Model.class);
                criteria.add(Restrictions.eq("name", model));

                if (!criteria.list().isEmpty()) {
                    responseObject.addProperty("message", "Model already exists!");
                } else {
                    Model m = new Model();
                    m.setName(model);
                    m.setBrand(brand);

                    s.save(m);
                    s.beginTransaction().commit();

                    responseObject.addProperty("status", true);
                    responseObject.addProperty("message", "Model added successfully!");
                }
            }

        }

        response.setContentType("application/json");
        response.getWriter().write(gson.toJson(responseObject));
    }
}
