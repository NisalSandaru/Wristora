package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import hibernate.Brand;
import hibernate.Color;
import hibernate.HibernateUtil;
import hibernate.Model;
import hibernate.OrderItems;
import hibernate.Orders;
import hibernate.Product;
import hibernate.Quality;
import hibernate.Status;
import hibernate.User;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;

@WebServlet(name = "LoadAdDashCount", urlPatterns = {"/LoadAdDashCount"})
public class LoadAdDashCount extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("status", false);
        Gson gson = new Gson();
        SessionFactory sf = HibernateUtil.getSessionFactory();
        Session s = sf.openSession();

        //product
        Criteria c1 = s.createCriteria(Product.class);
        c1.setProjection(Projections.rowCount());

        Long productCount = (Long) c1.uniqueResult();

        //orderItems
        Criteria c2 = s.createCriteria(OrderItems.class);
        List<OrderItems> orderItemsList = c2.list();

        //ordercount
        Criteria c3 = s.createCriteria(Orders.class);
        c3.setProjection(Projections.rowCount());

        Long orderCount = (Long) c3.uniqueResult();

        //ordercount
        Criteria c4 = s.createCriteria(User.class);
        c4.setProjection(Projections.rowCount());

        Long userCount = (Long) c4.uniqueResult();

        
        //load-product-data-end

        responseObject.add("productCount", gson.toJsonTree(productCount));
        responseObject.add("orderItemsList", gson.toJsonTree(orderItemsList));
        responseObject.add("orderCount", gson.toJsonTree(orderCount));

        responseObject.add("userCount", gson.toJsonTree(userCount));
        responseObject.addProperty("status", true);
        System.out.println(gson.toJson(responseObject));

        String toJson = gson.toJson(responseObject);
        resp.setContentType("application/json");
        resp.getWriter().write(toJson);
        s.close();
    }

}
