package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.HibernateUtil;
import hibernate.Product;
import hibernate.User;
import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import model.Util;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Restrictions;

@WebServlet(name = "UpdateProduct", urlPatterns = {"/UpdateProduct"})
public class UpdateProduct extends HttpServlet {

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        Gson gson = new Gson();
        JsonObject proData = gson.fromJson(req.getReader(), JsonObject.class);

        String productId = proData.get("productId").getAsString();
        String title = proData.get("title").getAsString();
        String description = proData.get("description").getAsString();
        String qty = proData.get("qty").getAsString();

        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("status", false);

        if (productId.isEmpty()) {
            responseObject.addProperty("message", "Product id not be empty!");
        } else if (!Util.isInteger(productId)) {
            responseObject.addProperty("message", "Invalid product Id!");
        } else if (title.isEmpty()) {
            responseObject.addProperty("message", "title Can not be empty!");
        } else if (description.isEmpty()) {
            responseObject.addProperty("message", "description Can not be empty!");
        } else if (qty.isEmpty()) {
            responseObject.addProperty("message", "qty Can not be empty!");
        } else if (!Util.isInteger(qty)) {
            responseObject.addProperty("message", "Invalid product qty!");
        } else {
            HttpSession ses = req.getSession();

            if (ses.getAttribute("admin") != null) {

                SessionFactory sf = HibernateUtil.getSessionFactory();
                Session s = sf.openSession();

                Criteria c = s.createCriteria(Product.class);
                c.add(Restrictions.eq("id", Integer.valueOf(productId)));  // session user email

                if (!c.list().isEmpty()) {

                    Product p = (Product) c.list().get(0);   // db user

                    p.setTitle(title);
                    p.setDescription(description);
                    p.setQty(Integer.parseInt(qty));

                    s.merge(p);

                    s.beginTransaction().commit();
                    responseObject.addProperty("status", true);
                    responseObject.addProperty("message", "Product details update successfully!");
                    s.close();

                }else{
                    responseObject.addProperty("message", "Product can not find!");
                }

            }else{
                responseObject.addProperty("message", "log in!");
            }
        }

        String toJson = gson.toJson(responseObject);
        resp.setContentType("application/json");
        resp.getWriter().write(toJson);

    }
}
