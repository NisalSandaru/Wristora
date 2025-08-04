package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.Brand;
import hibernate.HibernateUtil;
import hibernate.User;
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
@WebServlet(name = "AddBrand", urlPatterns = {"/AddBrand"})
public class AddBrand extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        Gson gson = new Gson();
        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("status", false);

        JsonObject data = gson.fromJson(req.getReader(), JsonObject.class);

        String brand = data.get("brand").getAsString();

        SessionFactory sf = HibernateUtil.getSessionFactory();
        Session s = sf.openSession();

        //validation
        if (req.getSession().getAttribute("admin") == null) {
            responseObject.addProperty("message", "Please sign in!");
        } else if (brand.isEmpty()) {
            responseObject.addProperty("message", "Invalid brand!");
        } else {
            Criteria criteria = s.createCriteria(Brand.class);
            criteria.add(Restrictions.eq("name", brand));

            if (!criteria.list().isEmpty()) {
                responseObject.addProperty("message", "Brand already exists!");
            } else {
                Brand b = new Brand();
                b.setName(brand);

                s.save(b);
                s.beginTransaction().commit();
                
                responseObject.addProperty("status", true);
                responseObject.addProperty("message", "Brand added successfully!");
            }

        }

        resp.setContentType("application/json");
        resp.getWriter().write(gson.toJson(responseObject));
    }

}
